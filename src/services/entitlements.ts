import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import { env, hasRevenueCatConfig } from "../config/env";
import type { EntitlementState } from "../types/production";

const freeEntitlement: EntitlementState = {
  plan: "free",
  isPremium: false,
  source: "local",
};

export async function configureRevenueCat(userId?: string) {
  if (!hasRevenueCatConfig()) {
    return false;
  }

  const apiKey = Platform.OS === "ios" ? env.revenueCatIosApiKey : env.revenueCatAndroidApiKey;
  if (!apiKey) {
    return false;
  }

  Purchases.configure({ apiKey, appUserID: userId });
  return true;
}

export async function getEntitlementState(): Promise<EntitlementState> {
  if (!hasRevenueCatConfig()) {
    return freeEntitlement;
  }

  try {
    const info = await Purchases.getCustomerInfo();
    const entitlement = info.entitlements.active[env.revenueCatEntitlementId];
    if (!entitlement) {
      return freeEntitlement;
    }

    return {
      plan: "premium",
      isPremium: true,
      source: "revenuecat",
      activeProductId: entitlement.productIdentifier,
      expiresAt: entitlement.expirationDate ?? undefined,
    };
  } catch {
    return freeEntitlement;
  }
}

export async function restorePurchases() {
  if (!hasRevenueCatConfig()) {
    return freeEntitlement;
  }

  await Purchases.restorePurchases();
  return getEntitlementState();
}
