"use server";

import * as auth from "./auth";
import * as posts from "./posts";
import * as taxonomies from "./taxonomies";
import * as comments from "./comments";
import * as media from "./media";
import * as settings from "./settings";

export async function loginAction(formData: FormData) {
  return auth.loginAction(formData);
}

export async function logoutAction() {
  return auth.logoutAction();
}

export async function setupAdminAction(formData: FormData) {
  return auth.setupAdminAction(formData);
}

export async function setupRootAdminAction(formData: FormData) {
  return auth.setupAdminAction(formData);
}

export async function savePostAction(id: string | null, data: Record<string, unknown>) {
  return posts.savePostAction(id, data);
}

export async function deletePostAction(id: string) {
  return posts.deletePostAction(id);
}

export async function duplicatePostAction(id: string) {
  return posts.duplicatePostAction(id);
}

export async function saveCategoryAction(
  id: string | null,
  data: { name: string; slug: string; description?: string }
) {
  return taxonomies.saveCategoryAction(id, data);
}

export async function deleteCategoryAction(id: string) {
  return taxonomies.deleteCategoryAction(id);
}

export async function saveTagAction(data: { name: string; slug: string }) {
  return taxonomies.saveTagAction(data);
}

export async function deleteTagAction(id: string) {
  return taxonomies.deleteTagAction(id);
}

export async function moderateCommentAction(
  id: string,
  status: "approved" | "rejected" | "pending"
) {
  return comments.moderateCommentAction(id, status);
}

export async function deleteCommentAction(id: string) {
  return comments.deleteCommentAction(id);
}

export async function uploadMediaAction(formData: FormData) {
  return media.uploadMediaAction(formData);
}

export async function deleteMediaAction(id: string) {
  return media.deleteMediaAction(id);
}

export async function saveSettingsAction(settingsMap: Record<string, string>) {
  return settings.saveSettingsAction(settingsMap);
}

export type { ActionResult } from "./types";
