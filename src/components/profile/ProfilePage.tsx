"use client";

import { FormEvent, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { FiLock, FiUser } from "react-icons/fi";

import { useAuth } from "@/context/AuthContext";
import { getUser, updateUser, type User } from "@/services/users";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    getUser(user.id)
      .then((data) => {
        setProfile(data);
        setFullName(data.fullName);
        setPhone(data.phone || "");
      })
      .catch(() => setMessage("Unable to load your profile."));
  }, [user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (password && password !== confirmPassword) {
      setMessage("The new passwords do not match.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      const updatedProfile = await updateUser(user.id, {
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        ...(password ? { password } : {}),
      });
      setProfile((currentProfile) => ({
        ...currentProfile,
        ...updatedProfile,
      }));
      setPassword("");
      setConfirmPassword("");
      setMessage("Profile updated successfully.");
    } catch (error) {
      const apiMessage = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setMessage(apiMessage || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="min-h-screen bg-[#FAF3E9] p-8 text-sm text-[#8A7567]">Loading profile...</div>;
  }

  const accountId = profile.role === "MEMBER" ? profile.memberId : profile.staffId;

  return (
    <div className="min-h-screen bg-[#FAF3E9] p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#2E211A]">My Profile</h1>
        <p className="mt-2 text-sm text-[#8C7B6B]">View your account information and update your name or password.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-6 rounded-2xl border border-[#E8DCC8] bg-[#FFFDF9] p-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-[#EFE5D8] pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E0D5]"><FiUser className="text-[#C97B4A]" size={24} /></div>
            <div><h2 className="text-lg font-bold text-[#4A362A]">{profile.fullName}</h2><p className="text-sm text-[#8A7567]">{profile.role}</p></div>
          </div>

          {message && <p className={`rounded-xl p-4 text-sm ${message === "Profile updated successfully." ? "bg-[#E5EBD9] text-[#59683E]" : "bg-[#FCE8E4] text-[#B23B2E]"}`}>{message}</p>}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#4A362A]">Full name<input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E5D8C8] bg-[#FAF3E9] px-4 py-3 font-normal outline-none focus:border-[#C97B4A]" /></label>
            <label className="block text-sm font-semibold text-[#4A362A]">Email<input disabled value={profile.email || ""} className="mt-2 w-full cursor-not-allowed rounded-xl border border-[#E5D8C8] bg-[#F1E7DA] px-4 py-3 font-normal text-[#8A7567]" /></label>
            <label className="block text-sm font-semibold text-[#4A362A]">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E5D8C8] bg-[#FAF3E9] px-4 py-3 font-normal outline-none focus:border-[#C97B4A]" /></label>
            <div className="text-sm font-semibold text-[#4A362A]">{profile.role === "MEMBER" ? "Member ID" : "Staff ID"}<p className="mt-2 rounded-xl border border-[#E5D8C8] bg-[#F1E7DA] px-4 py-3 font-normal text-[#8A7567]">{accountId || "Not assigned"}</p></div>
          </div>

          <div className="border-t border-[#EFE5D8] pt-6"><div className="flex items-center gap-2 text-base font-bold text-[#4A362A]"><FiLock /> Change password</div><p className="mt-1 text-sm text-[#8A7567]">Leave these fields empty to keep your current password.</p><div className="mt-4 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-[#4A362A]">New password<input type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E5D8C8] bg-[#FAF3E9] px-4 py-3 font-normal outline-none focus:border-[#C97B4A]" /></label><label className="text-sm font-semibold text-[#4A362A]">Confirm password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E5D8C8] bg-[#FAF3E9] px-4 py-3 font-normal outline-none focus:border-[#C97B4A]" /></label></div></div>

          <div className="flex justify-end border-t border-[#EFE5D8] pt-6"><button disabled={saving} className="rounded-xl bg-[#C97B4A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#B86C3E] disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button></div>
        </form>
      </div>
    </div>
  );
}
