import { useState } from "react";
import Swal from "sweetalert2";

interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const useGoogleOAuth = () => {
  const [loading, setLoading] = useState(false);

  const oauthSignIn = (
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<OAuthTokens | null> => {
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.send"
    )}&access_type=offline&prompt=consent`;

    const popup = window.open(authUrl, "_blank", "width=600,height=600");
    if (!popup) {
      Swal.fire("Popup bị chặn", "Vui lòng cho phép popup từ trình duyệt", "error");
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      const handler = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        const code = event.data?.code;
        if (!code) return;

        window.removeEventListener("message", handler);
        popup.close();

        try {
          const tokens = await exchangeCodeForTokens(clientId, clientSecret, redirectUri, code);
          resolve(tokens);
        } catch (err) {
          console.error("Lỗi đổi mã code:", err);
          reject(err);
        }
      };

      window.addEventListener("message", handler);
    });
  };

  const exchangeCodeForTokens = async (
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    code: string
  ): Promise<OAuthTokens> => {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const data = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });

    const tokenData = await response.json();

    if (!response.ok) {
      console.error("Token error:", tokenData);
      throw new Error(tokenData.error_description || "Lỗi khi đổi mã code lấy token.");
    }

    if (!tokenData.refresh_token) {
      throw new Error("Google không trả về refresh_token. Có thể bạn chưa thêm &prompt=consent hoặc tài khoản đã cấp quyền.");
    }

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    };
  };

  const getNewAccessToken = async (
    clientId: string,
    clientSecret: string,
    refreshToken: string
  ): Promise<string> => {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const data = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });

    const tokenData = await response.json();

    if (!response.ok) {
      console.error("Refresh token error:", tokenData);
      throw new Error(tokenData.error_description || "Lỗi khi lấy Token mới.");
    }

    return tokenData.access_token;
  };

  const getUserInfo = async (
    clientId: string,
    clientSecret: string,
    accessToken: string,
    refreshToken: string
  ): Promise<any> => {
    const tokenUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

    try {
      const response = await fetch(tokenUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        // Token hết hạn → làm mới
        const newAccessToken = await getNewAccessToken(clientId, clientSecret, refreshToken);
        return await getUserInfo(clientId, clientSecret, newAccessToken, refreshToken);
      }

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy thông tin người dùng: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi trong getUserInfo:", error);
      throw error;
    }
  };

  const validateGmailConfig = async (formData: any): Promise<OAuthTokens | null> => {
    setLoading(true);
    try {
      // Nếu chưa có token → gọi OAuth đăng nhập
      if (!formData.Token || !formData.RefreshToken) {
        const tokens = await oauthSignIn(formData.ClientId, formData.ClientSecret, formData.RedirectUri);
        if (!tokens) {
          Swal.fire("Cần đăng nhập vào Google trước khi lưu cấu hình", "", "error");
          return null;
        }
        formData.Token = tokens.accessToken;
        formData.RefreshToken = tokens.refreshToken;
      }

      // Kiểm tra thông tin người dùng
      const userInfo = await getUserInfo(formData.ClientId, formData.ClientSecret, formData.Token, formData.RefreshToken);

      if (userInfo.email?.toLowerCase() !== formData.SenderEmail?.toLowerCase()) {
        await Swal.fire({
          text: "Thông tin Email và ClientID đã đăng ký không khớp. Vui lòng kiểm tra lại.",
          icon: "warning",
          buttonsStyling: false,
          customClass: { confirmButton: "btn btn-warning" },
        });
        return null;
      }

      return {
        accessToken: formData.Token,
        refreshToken: formData.RefreshToken,
      };
    } catch (err: any) {
      console.error("Gmail config validation failed:", err.message);
      Swal.fire("Lỗi khi xác thực Gmail", err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    validateGmailConfig,
    loading,
  };
};