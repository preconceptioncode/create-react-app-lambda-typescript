import { createContainer } from "unstated-next";
import TrueVaultAPI from "../api/TrueVaultAPI";
import Messages from "../components/Messages";
import useAuthentication from "./Authentication";
import useTrueVaultUserAttributes from "./User/Attributes";
import useConditionals from "./User/Conditionals";
import useTrueVaultCredentials from "./User/Credentials";

// import { useImmer } from "use-immer";

function useTrueVault() {
  const { authenticated, logIn, logOut, setUsername } = useAuthentication();
  const { attributes, updateAttributes } = useTrueVaultUserAttributes();
  const { credentials, updateCredentials } = useTrueVaultCredentials();
  const { conditionals, calculateConditionals } = useConditionals();

  // useEffect(() => {
  //   calculateConditionals(attributes);
  // }, [attributes]);
  //ReRenders come from elsewhere thatn ^

  const accessToken = localStorage.getItem("accessToken");
  const updateTV = async function() {
    const { user_id } = credentials;
    if (accessToken && user_id) {
      const data: any = await TrueVaultAPI.updateUserAttributes(
        accessToken,
        user_id,
        attributes
      );
      switch (data.status) {
        case "succeeded":
          const { attributes, ...rest } = data.user;
          updateAttributes(() => attributes);
          updateCredentials(() => rest);
          break;
        case "failed":
          Messages.warning(
            "Please reload and try again - this may be an error"
          );
          break;
        case "disconnected":
          Messages.error("That didn't work, you may be offline", 8);
          break;
        default:
          Messages.error("Please report this error");
          throw new Error("hmmm... that didn't work");
      }
    } else return;
  };
  return {
    setUsername,
    updateTV,
    attributes,
    updateAttributes,
    updateCredentials,
    calculateConditionals,
    ...attributes,
    ...credentials,
    ...conditionals,
    authenticated,
    logIn,
    logOut
  };
}

const Store = createContainer(useTrueVault);
export default Store;
