"use client";

import UpdatePasswordForm from "./update-password-form";

export default function EditAccount(session) {
  return (
    <div className="mt-12 w-full md:w-1/2 xl:w-1/3">
      <h2 className="mb-4">Create or update password</h2>
      <UpdatePasswordForm></UpdatePasswordForm>
    </div>
  );
}
