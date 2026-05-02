import { useEffect } from "react";
import { apiGetAccount, apiGetPrivacy, apiGetPayment } from "../services/api";

function Profile() {
  useEffect(() => {
    // Placeholder side effects can be added later.
    // Example: fetch profile settings and account data.
    async function loadProfileData() {
      await Promise.all([apiGetAccount(), apiGetPrivacy(), apiGetPayment()]);
    }
    loadProfileData().catch(() => {
      // ignore for now
    });
  }, []);

  return (
    <div className="profile-page" style={{ padding: "2rem" }}>
      <h1>Profile & Settings</h1>
      <p>This page is under construction. Profile settings will appear here once implemented.</p>
    </div>
  );
}

export default Profile;
