export type TUserCredentials = {
  access_token?: string;
  user_id?: string;
  username?: string;
  status?: string;
  group_ids?: string[];
};

export type TUserAttributes = {
  app_version?: number;
  standard_written_consent_forms: TStandardWrittenConsentForm[];
  hiv_written_consent_forms: THIVWrittenConsentForm[];
  user_contacts: TUserContact[];
  staff_contacts: TStaffContact[];
  consent_calls: TUserConsentCall[];
  education_calls: TUserEducationCall[];
  profile: TUserProfile;
  purchases: TPurchase[];
  app_signup_agreements: TAppSignUpAgreement[];
  results: TResult[];
  user_progress_level?: TProgressLevel;
};

export type TProgressLevel =
  | "registered"
  | "purchased"
  | "ordered"
  | "visited"
  | "processed"
  | "deleted";

export type TUserContact = {
  type: "question" | any;
  sentVia: "app" | "text";
  timestamp: number;
  content: any;
};

export type TStaffContact = {
  staffMemberName: string;
  type: "reminder" | "followUp";
  sentVia: "email" | "text";
  timestamp: number;
  content: any;
};

export type TUserConsentCall = {
  staffMemberName: string;
  type: "additionalHIVConsent" | "other";
  timestamp: number;
  notes: string;
};

export type TUserEducationCall = {
  staffMemberName: string;
  type: "call";
  timestamp: number;
  notes: string;
};

export type TAppSignUpAgreement = {
  signup_timestamp: number;
  privacy_policy_checkbox: boolean;
  privacy_policy_version: number;
  terms_of_use_checkbox: boolean;
  terms_of_use_version: number;
};

export type TStandardWrittenConsentForm = {
  standard_written_consent_checkbox: boolean;
  standard_written_consent_signature: string;
  standard_written_consent_timestamp: number;
  standard_written_consent_version: number;
};

export type THIVWrittenConsentForm = {
  hiv_written_consent_checkbox: boolean;
  hiv_written_consent_signature: string;
  hiv_written_consent_timestamp: number;
  hiv_written_consent_version: number;
};

export type TState =
  | TNormalState
  | TBlacklistedState
  | TVerbalConsentState
  | TAdditionalReleaseofRecordsConsentState
  | TAdditionalHIVConsentState;
export type TNormalState =
  | "AK"
  | "AL"
  | "AR"
  | "AZ"
  | "CA"
  | "CT"
  | "DC"
  | "FL"
  | "GA"
  | "HI"
  | "IA"
  | "ID"
  | "IL"
  | "IN"
  | "KS"
  | "KY"
  | "LA"
  | "MD"
  | "ME"
  | "MI"
  | "MN"
  | "MO"
  | "MS"
  | "MT"
  | "NC"
  | "ND"
  | "NE"
  | "NH"
  | "NM"
  | "NV"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VA"
  | "VT"
  | "WA"
  | "WI"
  | "WV"
  | "WY";

export type TBlacklistedState = "NY" | "NJ" | "RI";

export type TVerbalConsentState = "CO" | "DE" | "MA";

export type TAdditionalHIVConsentState = "MD";

export type TAdditionalReleaseofRecordsConsentState = "MA";

export type TUserProfile = {
  city: string;
  dob: Date;
  email: string;
  first_name: string;
  last_name: string;
  line: string;
  line2: string;
  phone: string;
  state: TState;
  zip_code: number;
  ethnicity: string;
  race: string;
  history: string;
};

export type TPurchaseStatus =
  | "fulfilled"
  | "unfulfilled"
  | "cancelled"
  | "refunded";

export type TPurchase = {
  purchase_timestamp: number;
  purchase_status: TPurchaseStatus;
  amount: number;
  currency: string;
  quantity: number;
  sku: Sku;
  type: string;
  stripe_id: string;
  payment_intent: string;
  refund_data?: TRefund;
};

export type TRefund = {
  id: string;
  object: string;
  amount: number;
  balance_transaction: string;
  charge: string;
  created: number;
  currency: string;
  metadata: Metadata;
  reason: null;
  receipt_number: null;
  source_transfer_reversal: null;
  status: string;
  transfer_reversal: null;
};

interface Sku {
  id: string;
  object: string;
  active: boolean;
  attributes: SkuAttributes;
  created: number;
  currency: string;
  image: string;
  inventory: Inventory;
  livemode: boolean;
  metadata: Metadata;
  package_dimensions: null;
  price: number;
  product: string;
  updated: number;
}

interface SkuAttributes {
  name: string;
}

interface Inventory {
  quantity: null;
  type: string;
  value: null;
}

interface Metadata {}

export type TTestResult = {
  resultValueType: "number" | "string";
  status: "Normal" | "Abnormal" | "Caution";
  title: string;
  subtitle: string;
  result_unit: string;
  result_value: number;
  result_bottom_value?: number;
  result_middle_value?: number;
  result_top_value?: number;
  range_labels: string[];
  result_description: string;
};

export type TResultStatus = "incomplete" | "pending" | "resolved";

export type TResult = {
  test_package: "Essential" | "Plus";
  test_package_version: number;
  lab_visit_timestamp: number;
  result_status: TResultStatus;
  results_released: boolean;
  results_viewed: boolean;
  list_of_results: TTestResult[];
};

export type TUserConditionals = {
  editable: boolean;
  readyToPurchase: boolean;
  unpurchaseable: boolean;
  profileComplete: boolean;
  additionalVerbalHIVConsentState: boolean;
  additionalWrittenHIVConsentState: boolean;
  standardWrittenConsentSigned: boolean;
  HIVWrittenConsentSigned: boolean;
  additionalVerbalHIVConsentCallComplete: boolean;
  HIVWrittenConsentLatestVersion: boolean;
  standardWrittenConsentLatestVersion: boolean;
};
