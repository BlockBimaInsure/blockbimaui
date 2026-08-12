import type { UserRole } from "./auth";
export type { UserRole };

export interface Beneficiary {
  id: string;
  organizationId: string;
  externalId: string;
  gender: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  organizationId: string;
  productId: string;
  productName: string;
  regionId: string;
  regionName: string;
  beneficiaries: string[];
  status: "CONTRACT_STATUS_CREATED" | "CONTRACT_STATUS_DEPLOYED" | "CONTRACT_STATUS_SETTLED";
  totalPremium: number;
  maturityDate: string;
  smartContractAddress?: string;
  deployedAt?: string;
  settledAt?: string;
  settlementAmount?: number;
  settlementTransactionId?: string;
  reportInfo?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceProduct {
  id: string;
  name: string;
  premiumAmount: number;
  actuary: string;
  reportDataset: Record<string, unknown>;
  currency: "CURRENCY_USD" | "CURRENCY_KES";
  periodLength: number;
  periodType: "PERIOD_TYPE_DAYS" | "PERIOD_TYPE_WEEKS" | "PERIOD_TYPE_MONTHS" | "PERIOD_TYPE_YEARS";
  reportTrigger: "REPORT_TRIGGER_MATURITY" | "REPORT_TRIGGER_OCCURENCE" | "REPORT_TRIGGER_INTERVAL";
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
}

export interface Region {
  id: string;
  name: string;
  description?: string;
  thresholds: { productId: string; thresholdValue: number }[];
}

export interface DailyRainfall {
  date: string;
  amountMm: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  nextPageToken?: string;
}

export interface PaginationParams {
  pageSize?: number;
  pageToken?: string;
}

const BASE_URL = process.env.BLOCKBIMA_API_URL;
if (!BASE_URL) {
  throw new Error("BLOCKBIMA_API_URL environment variable is required");
}

async function request<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function safeList<T>(
  fetchList: () => Promise<PaginatedResponse<T>>
): Promise<PaginatedResponse<T>> {
  try {
    return await fetchList();
  } catch {
    return { data: [], total: 0 };
  }
}

export class BlockBimaAPI {
  async listBeneficiaries(
    orgId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Beneficiary>> {
    return safeList(async () => {
      const params = {
        organizationId: orgId,
        pageSize: pagination?.pageSize,
        pageToken: pagination?.pageToken,
      };
      const response = await request<{
        beneficiaries: Beneficiary[];
        total: number;
        nextPageToken?: string;
      }>("/beneficiary-management/v1/beneficiaries", params);

      return {
        data: response.beneficiaries,
        total: response.total,
        nextPageToken: response.nextPageToken,
      };
    });
  }

  async getBeneficiary(id: string): Promise<Beneficiary> {
    const response = await request<{ beneficiary: Beneficiary }>(
      `/beneficiary-management/v1/beneficiaries/${id}`
    );
    return response.beneficiary;
  }

  async listContracts(
    orgId: string,
    filters?: { productId?: string; regionId?: string; status?: string },
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Contract>> {
    return safeList(async () => {
      const params = {
        organizationId: orgId,
        productId: filters?.productId,
        regionId: filters?.regionId,
        status: filters?.status,
        pageSize: pagination?.pageSize,
        pageToken: pagination?.pageToken,
      };
      const response = await request<{
        contracts: Contract[];
        total: number;
        nextPageToken?: string;
      }>("/contract-management/v1/contracts", params);

      return {
        data: response.contracts,
        total: response.total,
        nextPageToken: response.nextPageToken,
      };
    });
  }

  async getContract(id: string): Promise<Contract> {
    const response = await request<{ contract: Contract }>(
      `/contract-management/v1/contracts/${id}`
    );
    return response.contract;
  }

  async listProducts(pagination?: PaginationParams): Promise<PaginatedResponse<InsuranceProduct>> {
    return safeList(async () => {
      const params = {
        pageSize: pagination?.pageSize,
        pageToken: pagination?.pageToken,
      };
      const response = await request<{
        insuranceProducts: InsuranceProduct[];
        total: number;
        nextPageToken?: string;
      }>("/product-management/v1/insurance-products", params);

      return {
        data: response.insuranceProducts,
        total: response.total,
        nextPageToken: response.nextPageToken,
      };
    });
  }

  async listRegions(pagination?: PaginationParams): Promise<PaginatedResponse<Region>> {
    return safeList(async () => {
      const params = {
        pageSize: pagination?.pageSize,
        pageToken: pagination?.pageToken,
      };
      const response = await request<{
        regions: Region[];
        total: number;
        nextPageToken?: string;
      }>("/region-management/v1/regions", params);

      return {
        data: response.regions,
        total: response.total,
        nextPageToken: response.nextPageToken,
      };
    });
  }
}

export const api = new BlockBimaAPI();