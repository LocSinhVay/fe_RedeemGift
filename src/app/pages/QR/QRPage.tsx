import React, { useState, useCallback, useMemo, useEffect } from "react";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { useAuth } from "../Login";
import { SearchableComboBox } from "../../components/searchableComboBox/SearchableComboBox";
import { allowPositiveNumbersOnly } from "../../hooks/allowPositiveNumbersOnly";
import { useProjects } from "../../hooks/useProjects";
import { OptionType } from "../../components/models/CommonModels";
import { useRedemptionRuleByProject } from "../../hooks/useRedemptionRuleByProject";
import { createSpinGrant } from "../../controllers/CustomerSpin/CustomerSpinController";

export const QRPage: React.FC = () => {
  const { auth } = useAuth();
  const { visibleProjects, isAll } = useProjects(true);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [billTotal, setBillTotal] = useState("0");
  const [spinCount, setSpinCount] = useState("0");
  const [billImage, setBillImage] = useState<File | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectCode, setProjectCode] = useState<OptionType | null>(null);

  // ✅ Gán mặc định Project
  useEffect(() => {
    if (auth?.SelectedProject && !isAll) {
      setSelectedProject(auth.SelectedProject);
    } else if (visibleProjects.length > 0) {
      setSelectedProject(String(visibleProjects[0].value));
    }
  }, [auth, visibleProjects, isAll]);

  const effectiveProjectCode = isAll
    ? projectCode?.value || selectedProject || ""
    : auth?.SelectedProject || "";

  // ✅ Lấy danh sách rule theo dự án
  const redemptionRules = useRedemptionRuleByProject(String(effectiveProjectCode));
  // ✅ Nếu không có rule → cho phép nhập tay
  const isManualMode = redemptionRules.length === 0;
  // ✅ Chọn rule phù hợp nhất theo mốc bill
  const rule = useMemo(() => {
    if (isManualMode) return null;

    const total = parseFloat(billTotal.replace(/,/g, "")) || 0;

    // Sắp xếp rule theo billValuePerSpin tăng dần
    const sortedRules = [...redemptionRules].sort(
      (a, b) => (a.billValuePerSpin ?? 0) - (b.billValuePerSpin ?? 0)
    );

    // Nếu bill < mốc thấp nhất => không có lượt
    if (total < (sortedRules[0].billValuePerSpin ?? 0)) return null;

    // Tìm rule có billValuePerSpin <= tổng bill, và là mốc cao nhất có thể
    const matched = sortedRules
      .filter((r) => (r.billValuePerSpin ?? 0) <= total)
      .reduce((prev, curr) =>
        (curr.billValuePerSpin ?? 0) > (prev.billValuePerSpin ?? 0) ? curr : prev
      );

    return matched ?? null;
  }, [billTotal, redemptionRules]);

  // ✅ Tự động tính số lượt quay
  useEffect(() => {
    const total = parseFloat(billTotal.replace(/,/g, "")) || 0;

    if (!rule || (rule.billValuePerSpin ?? 0) === 0) {
      setSpinCount("0");
      return;
    }

    let spins = 0;
    if (total >= (rule.billValuePerSpin ?? 0)) {
      spins = rule.maxSpinsPerBill ?? 0
      if (rule.maxSpinsPerBill)
        spins = Math.min(spins, rule.maxSpinsPerBill);
    }

    setSpinCount(spins.toString());
  }, [billTotal, rule]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setBillImage(e.target.files[0]);
  };

  const handleCaptureBill = () => {
    if (isAll) {
      setIsProjectModalOpen(true);
    } else {
      document.getElementById("bill-upload")?.click();
    }
  };

  const handleCreateSpinGrant = async (): Promise<string | null> => {
    if (!billImage) {
      setError("Vui lòng chụp ảnh bill.");
      return null;
    }
    if (!effectiveProjectCode) {
      setError("Vui lòng chọn dự án.");
      return null;
    }

    const spins = parseInt(spinCount, 10);
    if (!billTotal || isNaN(spins) || spins <= 0) {
      setError("Vui lòng nhập tổng giá trị bill và số lượt quay.");
      return null;
    }

    const formData = new FormData();
    formData.append("ProjectCode", String(effectiveProjectCode));
    formData.append("RuleID", String(rule?.ruleID ?? 0));
    formData.append("BillValue", billTotal.replace(/,/g, ""));
    formData.append("SpinsGranted", String(spins));
    formData.append("File", billImage);

    try {
      const response = await createSpinGrant(formData);
      if (response?.Data) return response.Data;
      else {
        setError("Tạo SpinGrant thất bại.");
        return null;
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tạo SpinGrant.");
      return null;
    }
  };

  const generateQrCode = useCallback(async () => {
    setError("");
    const encodedData = await handleCreateSpinGrant();
    if (!encodedData) return;
    const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || window.location.origin;
    const url = `${baseUrl}/spin/${encodedData}`;
    setQrData(url);
    setShowQr(true);
  }, [billTotal, spinCount, billImage, rule, effectiveProjectCode]);

  const resetForm = () => {
    setBillTotal("0");
    setSpinCount("0");
    setBillImage(null);
    setQrData(null);
    setError("");
    setShowQr(false);
  };

  return (
    <div className="min-vh-300 d-flex flex-column" style={{ backgroundColor: "#F9FAFB" }}>
      <div className="flex-grow-1 d-flex justify-content-center align-items-start p-3">
        <div className="w-100" style={{ maxWidth: "420px" }}>
          <div
            className="bg-white shadow-sm rounded overflow-hidden d-flex flex-column"
            style={{ minHeight: "88vh", maxHeight: "100vh" }}
          >
            {/* Header */}
            <div
              className="d-flex align-items-center fw-bold fs-6 py-3 px-2"
              style={{ backgroundColor: "#F3E8FF", color: "#6D28D9" }}
            >
              {showQr && (
                <button
                  type="button"
                  className="btn btn-link text-decoration-none me-2 p-0"
                  onClick={() => setShowQr(false)}
                >
                  <i className="bi bi-chevron-left fs-4"></i>
                </button>
              )}
              <span className="mx-auto">CHƯƠNG TRÌNH ĐỔI QUÀ</span>
            </div>

            {/* Nội dung */}
            <div className="p-4 text-center">
              {!showQr ? (
                <>
                  {/* Upload bill */}
                  <div className="mb-6">
                    <input
                      id="bill-upload"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="d-none"
                      onChange={handleImageChange}
                    />
                    <button
                      type="button"
                      className="btn btn-primary py-3"
                      onClick={handleCaptureBill}
                    >
                      <i className="bi bi-camera fs-3"></i>{" "}
                      {billImage ? billImage.name : "Chụp ảnh bill"}
                    </button>
                  </div>

                  {/* Tổng bill */}
                  <div className="mb-6">
                    <label
                      htmlFor="billTotal"
                      className="form-label fw-semibold small text-start d-block"
                    >
                      Tổng giá trị bill
                    </label>
                    <input
                      type="text"
                      id="billTotal"
                      value={billTotal}
                      onChange={(e) =>
                        setBillTotal(allowPositiveNumbersOnly(e.target.value))
                      }
                      className="form-control form-control-lg text-end rounded"
                    />
                  </div>

                  {/* Số lượt quay */}
                  <div className="mb-6">
                    <label
                      htmlFor="spinCount"
                      className="form-label fw-semibold small text-start d-block"
                    >
                      Số lượt quay thưởng
                    </label>
                    <input
                      type="text"
                      id="spinCount"
                      value={allowPositiveNumbersOnly(spinCount)}
                      onChange={(e) =>
                        setSpinCount(allowPositiveNumbersOnly(e.target.value))
                      }
                      className="form-control form-control-lg text-end rounded"
                      disabled={!isManualMode}
                    />
                  </div>

                  {error && <div className="alert alert-danger text-center p-2">{error}</div>}

                  <button
                    type="submit"
                    onClick={generateQrCode}
                    className="btn btn-primary w-100 fw-bold py-3 fs-6 rounded"
                  >
                    TẠO MÃ QR
                  </button>
                </>
              ) : (
                <>
                  <p className="text-muted mb-5 small text-center">
                    Khách hàng quét mã QR bên dưới để tham gia chương trình đổi quà
                  </p>
                  <div className="d-flex justify-content-center">
                    <div className="border rounded bg-white shadow-sm p-4">
                      <QRCode value={qrData || ""} size={220} />
                      <div className="mt-3 text-muted small text-break">{qrData}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={resetForm}
                      className="btn btn-light-primary w-100 fw-bold py-3 fs-6 rounded"
                    >
                      Tạo mã mới
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal chọn dự án */}
      {isProjectModalOpen && isAll && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Chọn dự án</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsProjectModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <SearchableComboBox
                    options={visibleProjects.map((p) => ({
                      value: String(p.value),
                      label: p.label,
                    }))}
                    value={projectCode}
                    onChange={(selected) =>
                      setProjectCode(selected || { value: "", label: "Chọn dự án" })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-light"
                    onClick={() => setIsProjectModalOpen(false)}
                  >
                    Trở về
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (projectCode?.value) {
                        setSelectedProject(String(projectCode.value));
                        setIsProjectModalOpen(false);
                        document.getElementById("bill-upload")?.click();
                      }
                    }}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
