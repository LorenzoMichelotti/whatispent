"use client";

import UpdatePasswordForm from "./update-password-form";

export default function EditAccount(session) {
  return (
    <div className="mt-8 w-1/2">
      <h2>Create or update password</h2>
      <UpdatePasswordForm></UpdatePasswordForm>
    </div>
  );
}
