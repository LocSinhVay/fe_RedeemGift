import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CanvasWheel from "./CanvasWheel";
import { allowPositiveNumbersOnly } from "../../hooks/allowPositiveNumbersOnly";
import {
  claimSpins,
  getDetailSpinInfoBySpinGrantId,
  spinWheel,
} from "../../controllers/CustomerSpin/CustomerSpinController";

// Định nghĩa lại kiểu cho Prize
interface PrizeItem {
  PrizeID: number;
  PrizeName: string;
}

export const LuckyWheelPage: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isInfoSubmitted, setIsInfoSubmitted] = useState(false);

  const [spinCount, setSpinCount] = useState(0);
  // Thay đổi kiểu của prizes để lưu cả PrizeID và PrizeName
  const [prizes, setPrizes] = useState<PrizeItem[]>([]);
  const [prize, setPrize] = useState<string | null>(null);
  // Thay đổi để lưu PrizeID từ backend
  const [backendPrizeId, setBackendPrizeId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { spinGrantId } = useParams<{ spinGrantId: string }>();

  // Load dữ liệu vòng quay
  useEffect(() => {
    if (!spinGrantId) return;
    setIsLoading(true);

    getDetailSpinInfoBySpinGrantId(spinGrantId)
      .then((res) => {
        const data = res.Data as Array<{
          SpinGrantID: string;
          PrizeID: number;
          PrizeName: string;
          SpinsGranted: number;
        }>;

        if (data && data.length > 0) {
          // Lưu cả PrizeID và PrizeName
          setPrizes(data.map((d) => ({ PrizeID: d.PrizeID, PrizeName: d.PrizeName })));
          setSpinCount(data[0].SpinsGranted); // Giả sử SpinsGranted là số lượt quay ban đầu
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [spinGrantId]);

  // Gửi thông tin người chơi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (!spinGrantId) {
      alert("Không tìm thấy SpinGrantId.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("SpinGrantID", spinGrantId);
      formData.append("CustomerName", name);
      formData.append("CustomerPhone", phone);

      const res = await claimSpins(formData);
      if (res?.Data >= 0) {
        setIsInfoSubmitted(true);
      } else {
        alert(res?.Message || "Lưu thông tin thất bại. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi lưu thông tin!");
    }
  };

  // Xử lý khi nhấn quay
  const handleSpinClick = async () => {
    if (!spinGrantId || isSpinning || spinCount <= 0) return;

    setPrize(null);
    setMessage(null);
    setBackendPrizeId(null); // Reset PrizeID backend

    try {
      const res = await spinWheel(spinGrantId);
      if (res?.Data) {
        const { PrizeID, PrizeName, SpinsRemaining } = res.Data;
        setBackendPrizeId(PrizeID); // Lưu PrizeID từ backend
        setSpinCount(SpinsRemaining);
        setMessage("Đang quay... \nChúc bạn may mắn!");
      } else {
        setMessage(res?.Message || "Có lỗi khi quay. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi xảy ra khi quay!");
      setIsSpinning(false);
    }
  };

  if (isLoading) return <div className="text-center mt-5">Đang tải...</div>;

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <div
          className="bg-white shadow-sm rounded overflow-hidden d-flex flex-column"
          style={{ minHeight: "100vh" }}
        >
          {/* Header */}
          <div
            className="text-center fw-bold fs-6 py-3"
            style={{ backgroundColor: "#F3E8FF", color: "#6D28D9" }}
          >
            CHƯƠNG TRÌNH ĐỔI QUÀ
          </div>

          {/* Main */}
          <div className="flex-grow-1 p-4 d-flex flex-column justify-content-between">
            {!isInfoSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex-grow-1 d-flex flex-column justify-content-between"
              >
                <div>
                  <div className="mb-10">
                    <label className="required form-label fw-semibold small">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Nhập họ tên"
                    />
                  </div>

                  <div className="mb-10">
                    <label className="required form-label fw-semibold small">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(allowPositiveNumbersOnly(e.target.value, "phone"))
                      }
                      className="form-control form-control-lg"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div className="text-center mb-10">
                    <div className="fw-bold text-danger small mb-10">
                      SỐ LƯỢT QUAY THƯỞNG
                    </div>
                    <div className="d-inline-flex spin-badge fw-bold fs-1 text-white justify-content-center align-items-center">
                      {spinCount}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-bold py-3 fs-6 rounded"
                    disabled={spinCount === 0}
                  >
                    XÁC NHẬN
                  </button>
                </div>
              </form>
            ) : (
              <div className="d-flex flex-column align-items-center flex-grow-1 justify-content-between text-center">
                <div>
                  <p
                    className="fs-6 fw-bold text-center my-3 mb-10"
                    style={{ color: "#EF4444" }}
                  >
                    BẠN CÒN {spinCount} LƯỢT QUAY THƯỞNG
                  </p>
                  <CanvasWheel
                    prizes={prizes} // Truyền mảng đối tượng prizes
                    spinCount={spinCount}
                    resultPrizeId={backendPrizeId} // Truyền PrizeID xuống
                    onSpinStart={() => setIsSpinning(true)}
                    onSpinEnd={(p) => {
                      setIsSpinning(false);
                      setPrize(p); // PrizeName
                      setBackendPrizeId(null); // Reset PrizeID sau khi quay xong
                      setMessage(`Chúc mừng!\nBạn nhận được 01 ${p}`);
                    }}
                    onRequestSpin={handleSpinClick}
                  />

                  {message && (
                    <p
                      className={`fw-bold fs-5 mt-10 ${isSpinning ? "text-warning" : "text-success"
                        }`} style={{ whiteSpace: "pre-line" }}
                    >
                      {message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};