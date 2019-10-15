import { useImmer } from "use-immer";
import {
  THIVWrittenConsentForm,
  TStandardWrittenConsentForm,
  TUserAttributes,
  TUserConditionals,
  TUserProfile
} from "../types";

export default function useConditionals() {
  const [conditionals, updateConditionals] = useImmer<
    Partial<TUserConditionals>
  >({});

  function calculateConditionals(attributes: Partial<TUserAttributes>) {
    console.log("Attributes inside of calculate conditionals", {
      ...attributes
    });
    updateConditionals(() => {
      return {
        ...profileComplete(attributes),
        ...standardWrittenConsentSigned(attributes),
        ...unpurchaseable(attributes),
        ...additionalVerbalHIVConsentState(attributes),
        ...additionalWrittenHIVConsentState(attributes),
        ...HIVWrittenConsentSigned(attributes),
        ...editable(attributes),
        ...readyToPurchase(attributes, conditionals)
      };
    });
  }

  return { conditionals, calculateConditionals };
}

function profileComplete(attributes: Partial<TUserAttributes>): object {
  const { profile } = attributes;
  if (profile) {
    let data: Partial<TUserProfile> = profile;
    if (
      data.city &&
      data.first_name &&
      data.dob &&
      data.email &&
      data.last_name &&
      data.line &&
      data.phone &&
      data.state &&
      data.zip_code
    )
      return { profileComplete: true };
    else return { profileComplete: false };
  } else return {};
}

function standardWrittenConsentSigned(
  attributes: Partial<TUserAttributes>
): object {
  const { standard_written_consent_forms, purchases } = attributes;
  if (standard_written_consent_forms && purchases) {
    let data: Partial<
      TStandardWrittenConsentForm[]
    > = standard_written_consent_forms;
    if (data.length > purchases.length) {
      return { standardWrittenConsentSigned: true };
    } else {
      return { standardWrittenConsentSigned: false };
    }
  } else return {};
}

function HIVWrittenConsentSigned(attributes: Partial<TUserAttributes>): object {
  const { hiv_written_consent_forms, purchases } = attributes;
  if (hiv_written_consent_forms && purchases) {
    let data: Partial<THIVWrittenConsentForm[]> = hiv_written_consent_forms;
    if (data.length >= purchases.length) {
      return { HIVWrittenConsentSigned: true };
    } else {
      return { HIVWrittenConsentSigned: false };
    }
  } else return {};
}

function editable(attributes: Partial<TUserAttributes>): object {
  const { user_progress_level } = attributes;
  if (user_progress_level === "registered") {
    return { editable: true };
  }
  if (user_progress_level === "processed") {
    return { editable: true };
  } else return { editable: false };
}

function unpurchaseable(attributes: Partial<TUserAttributes>): object {
  const { profile } = attributes;
  if (profile) {
    let data: Partial<TUserProfile> = profile;
    if (
      ["NJ", "NY", "RI"].find(function(element) {
        return element === data.state;
      })
    ) {
      return { unpurchaseable: true };
    } else return { unpurchaseable: false };
  } else return {};
}

function additionalWrittenHIVConsentState(
  attributes: Partial<TUserAttributes>
): object {
  const { profile } = attributes;
  if (profile) {
    let data: Partial<TUserProfile> = profile;
    if (
      ["MD"].find(function(element) {
        return element === data.state;
      })
    ) {
      return { additionalWrittenHIVConsentState: true };
    } else return { additionalWrittenHIVConsentState: false };
  } else return {};
}

function additionalVerbalHIVConsentState(
  attributes: Partial<TUserAttributes>
): object {
  const { profile } = attributes;
  if (profile) {
    let data: Partial<TUserProfile> = profile;
    if (
      ["CO", "DE", "MA"].find(function(element) {
        return element === data.state;
      })
    ) {
      return { additionalVerbalHIVConsentState: true };
    } else return { additionalVerbalHIVConsentState: false };
  } else return {};
}

function readyToPurchase(
  attributes: Partial<TUserAttributes>,
  conditionals: Partial<TUserConditionals>
): object {
  const { profile } = attributes;
  const {
    profileComplete,
    standardWrittenConsentSigned,
    HIVWrittenConsentSigned
  } = conditionals;
  if (profile) {
    let data: Partial<TUserProfile> = profile;
    if (
      ["MD"].find(function(element) {
        return element === data.state;
      }) &&
      profileComplete &&
      standardWrittenConsentSigned &&
      HIVWrittenConsentSigned
    ) {
      return { readyToPurchase: true };
    } else if (profileComplete && standardWrittenConsentSigned) {
      return { readyToPurchase: true };
    } else return { readyToPurchase: false };
  } else return {};
}
