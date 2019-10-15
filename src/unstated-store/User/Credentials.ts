import { TUserCredentials } from "../types";
import { useImmer } from "use-immer";

export default function useTrueVaultCredentials() {
  const [credentials, updateCredentials] = useImmer<Partial<TUserCredentials>>(
    {}
  );
  return { credentials, updateCredentials };
}
