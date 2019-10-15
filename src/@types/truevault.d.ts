declare module "truevault";

/**
 * A client for the [TrueVault HTTP API](https://docs.truevault.com/).
 *
 * **Overview**
 *
 * The TrueVault JS SDK makes it easy to communicate with the TrueVault API from JavaScript web apps, nodejs servers,
 * and lambda methods.
 *
 * ***JS Web example***
 * ```js
 * async function onLoginClicked() {
 *   var trueVaultClient = await TrueVault.login(TRUEVAULT_ACCOUNT_ID, username, password)
 *   localStorage.trueVaultAccessToken = TrueVaultClient.accessToken;
 *   var userInfo = trueVaultClient.readCurrentUser();
 
 * }
 * ```
 *
 * **Error Handling**
 *
 * If any request fails, the method will throw an error. The thrown `Error` instance will have the following properties:
 *
 * - `message`: the message returned by the TrueVault API
 * - `transaction_id`: a unique ID that can be used in support requests to help@truevault.com to help us resolve the error
 * - `error`: the machine-readable error object returned by TrueVault.
 *
 * For more information on TrueVault API responses, see https://docs.truevault.com/overview#api-responses.
 *
 * **Authentication**
 *
 * If you already have an API key or access token, use the constructor. If you have a username and password, see
 * `login()`. See https://docs.truevault.com/overview#authentication for more on authentication concepts in TrueVault.
 *
 * To authenticate, provide one of the following styles of objects based on how you wish to authenticate:
 *
 * - `{ apiKey: 'your API key' }`
 * - `{ accessToken: 'your access token' }`
 * - `{ httpBasic: 'http basic base64 string' }`
 * - `null`, to indicate no authentication is to be provided to the server
 */
declare class TrueVaultClient {
  constructor(authn: object, host: string);
  /**
   * Returns the TrueVault access token that was supplied in the constructor/returned from the login call. Throws
   * if the client was created without an access token (e. g. created with an API key).
   * @returns
   */
  accessToken: any;
  /**
   * Returns the Authentication: header used for making requests (e. g. "Basic ABC123"). Useful if you need to make
   * raw requests for some reason.
   * @returns
   */
  authHeader: any;
  /**
   * Performs a legacy (non-v2-JSON) request. By using XHR rather than fetch, it's able to supply progress
   * information.
   * @param method
   * @param url
   * @param formData
   * @param progressCallback
   * @param responseType
   * @returns A promise resolving to an XHR object for blobs, and the parsed JSON object for JSON
   */
  performLegacyRequestWithProgress(
    method: any,
    url: any,
    formData: any,
    progressCallback: any,
    responseType: any
  ): Promise<Object>;
  /**
   * Useful when you want to create a client starting from a user's username and password as opposed to an API key
   * or access token. The resulting TrueVaultClient has an accessToken property you can use to retrieve the raw
   * TrueVault access token if needed (e. g. to save in localStorage).
   * See https://docs.truevault.com/authentication#login-a-user.
   * @param accountId account id that the user belongs to.
   * @param username user's username.
   * @param password user's password.
   * @param mfaCode current MFA code, if user has MFA configured.
   * @param host host optional parameter specifying TV API host; defaults to https://api.truevault.com
   * @param notValidAfter notValidAfter optional parameter specifying when the returned access token expires
   * @returns
   */
  static login(
    accountId: string,
    username: string,
    password: string,
    mfaCode?: string,
    host?: string,
    notValidAfter?: Date
  ): Promise<TrueVaultClient>;
  /**
   * Log in with a username and password and return the resulting access token.
   * See https://docs.truevault.com/authentication#login-a-user.
   * @param accountId account id that the user belongs to.
   * @param username user's username.
   * @param password user's password.
   * @param mfaCode current MFA code, if user has MFA configured.
   * @param host host optional parameter specifying TV API host; defaults to https://api.truevault.com
   * @param notValidAfter notValidAfter optional parameter specifying when the returned access token expires
   * @returns
   */
  static generateAccessToken(
    accountId: string,
    username: string,
    password: string,
    mfaCode?: string,
    host?: string,
    notValidAfter?: Date
  ): Promise<string>;
  /**
   * Log the authenticated user out, which deactivates its access token. See
   * https://docs.truevault.com/authentication#logout-a-user.
   * @returns
   */
  logout(): Promise<Object>;
  /**
   * Get data about the authenticated user. See https://docs.truevault.com/authentication#verify-a-user.
   * @param full Whether to include user attributes and groups
   * @returns
   */
  readCurrentUser(full?: any): Promise<Object>;
  /**
   * Updates the currently authenticated user's attributes. See https://docs.truevault.com/authentication#verify-a-user.
   * @param attributes
   * @returns
   */
  updateCurrentUser(attributes: any): Promise<Object>;
  /**
   * List all users in the account. See https://docs.truevault.com/users#list-all-users.
   * @param full Whether to return user attributes and group IDs
   * @returns
   */
  listUsers(full?: any): Promise<[object, Object]>;
  /**
   * List all users in the account. See https://docs.truevault.com/users#list-all-users.
   * @param status If ACTIVE, DEACTIVATED, PENDING, or LOCKED only returns users with that status
   * @param full Whether to return user attributes and group IDs
   * @returns
   */
  listUsersWithStatus(status?: any, full?: any): Promise<[object, Object]>;
  /**
   * Read a single user. See https://docs.truevault.com/users#read-a-user.
   * @returns
   */
  readUser(): Promise<Object>;
  /**
   * Reads multiple users. See https://docs.truevault.com/users#read-a-user.
   * @returns
   */
  readUsers(): Promise<[object, Object]>;
  /**
   * Create a new user. See https://docs.truevault.com/users#create-a-user.
   * @param username new user's username.
   * @param password new user's password.
   * @param attributes new user's attributes, if desired.
   * @param groupIds add user to the given groups, if provided.
   * @param status the newly created user's status
   * @returns
   */
  createUser(
    username: string,
    password: string,
    attributes?: Object,
    groupIds?: any[],
    status?: string
  ): Promise<Object>;
  /**
   * Update a user's attributes. See https://docs.truevault.com/users#update-a-user.
   * @param userId the user's userId
   * @param attributes
   * @returns
   */
  updateUserAttributes(userId: string, attributes: Object): Promise<Object>;
  /**
   * Update a user's status. See https://docs.truevault.com/users#update-a-user.
   * @param userId the user's userId
   * @param status
   * @returns
   */
  updateUserStatus(userId: string, status: string): Promise<Object>;
  /**
   * Update a user's username. See https://docs.truevault.com/users#update-a-user.
   * @param userId the user id to change.
   * @param newUsername user's new username.
   * @returns
   */
  updateUserUsername(userId: string, newUsername: string): Promise<Object>;
  /**
   * Update a user's password. See https://docs.truevault.com/users#update-a-user.
   * @param userId the user id to change.
   * @param newPassword user's new password.
   * @returns
   */
  updateUserPassword(userId: string, newPassword: string): Promise<Object>;
  /**
   * Delete a user. See https://docs.truevault.com/users#delete-a-user
   * @param userId the user id to delete.
   * @returns
   */
  deleteUser(userId: string): Promise<Object>;
  /**
   * Create an API key for a user. See https://docs.truevault.com/users#create-api-key-for-a-user.
   * @param userId user id.
   * @returns
   */
  createUserApiKey(userId: string): Promise<string>;
  /**
   * Create an access token for a user. See https://docs.truevault.com/users#create-access-token-for-a-user.
   * @param userId user id.
   * @param notValidAfter notValidAfter optional parameter specifying when the returned access token expires
   * @returns
   */
  createUserAccessToken(userId: string, notValidAfter?: Date): Promise<string>;
  /**
   * Start MFA enrollment for a user. See https://docs.truevault.com/users#start-mfa-enrollment-for-a-user.
   * @param userId user id.
   * @param issuer MFA issuer.
   * @returns
   */
  startUserMfaEnrollment(userId: string, issuer: string): Promise<Object>;
  /**
   * Finalize MFA enrollment for a user. See https://docs.truevault.com/users#finalize-mfa-enrollment-for-a-user.
   * @param userId user id.
   * @param mfaCode1 first MFA code.
   * @param mfaCode2 second MFA code.
   * @returns
   */
  finalizeMfaEnrollment(
    userId: string,
    mfaCode1: string,
    mfaCode2: string
  ): Promise<undefined>;
  /**
   * Unenroll a user from MFA. See #https://docs.truevault.com/users#unenroll-mfa-for-a-user.
   * @param userId user id.
   * @param mfaCode MFA code for user.
   * @param password user's password.
   * @returns
   */
  unenrollMfa(
    userId: string,
    mfaCode: string,
    password: string
  ): Promise<undefined>;
  /**
   * Create a new group. See https://docs.truevault.com/groups#create-a-group.
   * @param name group name.
   * @param policy group policy. See https://docs.truevault.com/groups.
   * @param userIds user ids to add to the group.
   * @returns
   */
  createGroup(name: string, policy: any[], userIds?: any[]): Promise<Object>;
  /**
   * Update an existing group's name and policy. See https://docs.truevault.com/groups#update-a-group.
   * @param groupId group id to update.
   * @param name group name.
   * @param policy group policy. See https://docs.truevault.com/groups.
   * @returns
   */
  updateGroup(groupId: string, name: string, policy: any[]): Promise<Object>;
  /**
   * Delete a group. See https://docs.truevault.com/groups#delete-a-group.
   * @param groupId group id to delete.
   * @returns
   */
  deleteGroup(groupId: string): Promise<Object>;
  /**
   * List all groups. See https://docs.truevault.com/groups#list-all-groups.
   * @returns
   */
  listGroups(): Promise<[object, Object]>;
  /**
   * Gets a group, including user ids. See https://docs.truevault.com/groups#read-a-group.
   * @param groupId group id to get.
   * @returns
   */
  readFullGroup(groupId: string): Promise<Object>;
  /**
   * Add users to a group. See https://docs.truevault.com/groups#add-users-to-a-group.
   * @param groupId group to add to.
   * @param userIds user ids to add to the group.
   * @returns
   */
  addUsersToGroup(groupId: string, userIds: any[]): Promise<undefined>;
  /**
   * Remove users from a group. See https://docs.truevault.com/groups#remove-users-from-a-group
   * @param groupId group to add to.
   * @param userIds user ids to add to the group.
   * @returns
   */
  removeUsersFromGroup(groupId: string, userIds: any[]): Promise<undefined>;
  /**
   * Add users to a group returning user ids. See https://docs.truevault.com/groups#update-a-group.
   * @param groupId group to add to.
   * @param userIds user ids to add to the group.
   * @returns
   */
  addUsersToGroupReturnUserIds(
    groupId: string,
    userIds: any[]
  ): Promise<Object>;
  /**
   * Remove users from a group. See https://docs.truevault.com/groups#update-a-group
   * @param groupId group to remove from.
   * @param userIds user ids to remove from the group.
   * @returns
   */
  removeUsersFromGroupReturnUserIds(
    groupId: string,
    userIds: any[]
  ): Promise<Object>;
  /**
   * Perform a user search. See https://docs.truevault.com/documentsearch#search-users.
   * @param searchOption search query. See https://docs.truevault.com/documentsearch#defining-search-options.
   * @returns
   */
  searchUsers(searchOption: Object): Promise<Object>;
  /**
   * Lists all vaults. See https://docs.truevault.com/vaults#list-all-vaults.
   * @param page
   * @param per_page
   * @returns
   */
  listVaults(page?: any, per_page?: any): Promise<any>;
  /**
   * Create a new vault. See https://docs.truevault.com/vaults#create-a-vault.
   * @param name the name of the new vault.
   * @returns
   */
  createVault(name: string): Promise<Object>;
  /**
   * Read a vault. See https://docs.truevault.com/vaults#read-a-vault
   * @param vaultId
   * @returns
   */
  readVault(vaultId: any): Promise<Object>;
  /**
   * Update a vault. See https://docs.truevault.com/vaults#update-a-vault
   * @param vaultId
   * @param name
   * @returns
   */
  updateVault(vaultId: any, name: any): Promise<Object>;
  /**
   * Delete a vault. See https://docs.truevault.com/vaults#delete-a-vault
   * @param vaultId
   * @returns
   */
  deleteVault(vaultId: any): Promise<Object>;
  /**
   * Create a new schema. See https://docs.truevault.com/schemas#create-a-schema.
   * @param vaultId the vault that should contain the schema.
   * @param name the name of the schema.
   * @param fields field metadata for the schema. See https://docs.truevault.com/schemas.
   * @returns
   */
  createSchema(vaultId: string, name: string, fields: any[]): Promise<Object>;
  /**
   * Create a new schema. See https://docs.truevault.com/schemas#update-a-schema
   * @param vaultId the vault that should contain the schema.
   * @param schemaId the schemathat should contain the schema.
   * @param name the name of the schema.
   * @param fields field metadata for the schema. See https://docs.truevault.com/schemas.
   * @returns
   */
  updateSchema(
    vaultId: string,
    schemaId: string,
    name: string,
    fields: any[]
  ): Promise<Object>;
  /**
   * Read a schema. See https://docs.truevault.com/schemas#read-a-schema
   * @param vaultId
   * @param schemaId
   * @returns
   */
  readSchema(vaultId: any, schemaId: any): Promise<Object>;
  /**
   * List all schemas in a vault. See https://docs.truevault.com/schemas#list-all-schemas
   * @param vaultId
   * @returns
   */
  listSchemas(vaultId: any): Promise<Object>;
  /**
   * Delete a schema. See https://docs.truevault.com/schemas#delete-a-schema
   * @param vaultId
   * @param schemaId
   * @returns
   */
  deleteSchema(vaultId: any, schemaId: any): Promise<undefined>;
  /**
   * Create the user schema. See https://docs.truevault.com/schemas#create-the-user-schema
   * @param accountId account id that the user schema belongs to.
   * @param name the name of the schema.
   * @param fields field metadata for the schema. See https://docs.truevault.com/schemas.
   * @returns
   */
  createUserSchema(
    accountId: string,
    name: string,
    fields: any[]
  ): Promise<Object>;
  /**
   * Read the user schema. See https://docs.truevault.com/schemas#read-the-user-schema
   * @param accountId account id that the user schema belongs to.
   * @returns
   */
  readUserSchema(accountId: string): Promise<Object>;
  /**
   * Update the user schema. See https://docs.truevault.com/schemas#update-the-user-schema
   * @param accountId account id that the user schema belongs to.
   * @param name the name of the schema.
   * @param fields field metadata for the schema. See https://docs.truevault.com/schemas.
   * @returns
   */
  updateUserSchema(
    accountId: string,
    name: string,
    fields: any[]
  ): Promise<Object>;
  /**
   * Delete the user schema. See https://docs.truevault.com/schemas#delete-the-user-schema
   * @param accountId account id that the user schema belongs to.
   * @returns
   */
  deleteUserSchema(accountId: string): Promise<Object>;
  /**
   * Create a new document. See https://docs.truevault.com/documents#create-a-document.
   * @param vaultId vault to place the document in.
   * @param schemaId schema to associate with the document.
   * @param document document contents.
   * @param ownerId the document's owner.
   * @returns
   */
  createDocument(
    vaultId: string,
    schemaId: string | null,
    document: Object,
    ownerId?: string | null
  ): Promise<Object>;
  /**
   * List documents in a vault. See https://docs.truevault.com/documents#list-all-documents.
   * @param vaultId vault to look in.
   * @param full include document contents in listing.
   * @param page which page to get, if pagination is needed.
   * @param perPage number of documents per page.
   * @returns
   */
  listDocuments(
    vaultId: string,
    full: boolean,
    page?: number,
    perPage?: number
  ): Promise<Object>;
  /**
   * List documents in a schema. See https://docs.truevault.com/documents#list-all-documents-with-schema
   * @param vaultId vault to look in.
   * @param schemaId
   * @param full include document contents in listing.
   * @param page which page to get, if pagination is needed.
   * @param perPage number of documents per page.
   * @returns
   */
  listDocumentsInSchema(
    vaultId: string,
    schemaId: string,
    full?: boolean,
    page?: number,
    perPage?: number
  ): Promise<Object>;
  /**
   * Get the contents of one or more documents. See https://docs.truevault.com/documents#read-a-document.
   * @param vaultId vault to look in.
   * @param documentIds document ids to retrieve.
   * @returns
   */
  getDocuments(vaultId: string, documentIds: any[]): Promise<[object, Object]>;
  /**
   * Perform a search. See https://docs.truevault.com/documentsearch#search-documents.
   * @param vaultId vault to search in.
   * @param searchOption search query. See https://docs.truevault.com/documentsearch#defining-search-options.
   * @returns
   */
  searchDocuments(vaultId: string, searchOption: Object): Promise<Object>;
  /**
   * Update an existing document. See https://docs.truevault.com/documents#update-a-document.
   * @param vaultId vault that contains the document.
   * @param documentId document id to update.
   * @param document new document contents.
   * @param ownerId the new document owner.
   * @param schemaId the new document schema.
   * @returns
   */
  updateDocument(
    vaultId: string,
    documentId: string,
    document: Object,
    ownerId?: string | null,
    schemaId?: string | null
  ): Promise<Object>;
  /**
   * Update a document's owner. See https://docs.truevault.com/documents#update-a-document-s-owner.
   * @param vaultId the vault containing the document.
   * @param documentId id of the document.
   * @param ownerId the new document owner, or '' to remove owner.
   * @returns
   */
  updateDocumentOwner(
    vaultId: string,
    documentId: string,
    ownerId: string
  ): Promise<Object>;
  /**
   * Delete a document. See https://docs.truevault.com/documents#delete-a-document.
   * @param vaultId vault that contains the document.
   * @param documentId document id to delete.
   * @returns
   */
  deleteDocument(vaultId: string, documentId: string): Promise<Object>;
  /**
   * Create a BLOB. See https://docs.truevault.com/blobs#create-a-blob.
   * @param vaultId vault that will contain the blob.
   * @param file the BLOB's contents.
   * @param ownerId the BLOB's owner.
   * @returns
   */
  createBlob(
    vaultId: string,
    file: File | Blob,
    ownerId?: string | null
  ): Promise<Object>;
  /**
   * Create a BLOB with a callback for progress updates. See https://docs.truevault.com/blobs#create-a-blob.
   * @param vaultId vault that will contain the blob.
   * @param file the BLOB's contents.
   * @param progressCallback callback for XHR's `progress` and `load` events.
   * @param ownerId the BLOB's owner.
   * @returns
   */
  createBlobWithProgress(
    vaultId: string,
    file: File | Blob,
    progressCallback: Function,
    ownerId?: string | null
  ): Promise<Object>;
  /**
   * Update a BLOB with a callback for progress updates. See https://docs.truevault.com/blobs#update-a-blob.
   * @param vaultId vault that contains the blob.
   * @param blobId the ID of the blob being updated
   * @param file the BLOB's contents.
   * @param progressCallback callback for XHR's `progress` and `load` events.
   * @param ownerId the BLOB's new owner.
   * @returns
   */
  updateBlobWithProgress(
    vaultId: string,
    blobId: string,
    file: File | Blob,
    progressCallback: Function,
    ownerId?: string | null
  ): Promise<any>;
  /**
   * Get a BLOB with a callback for progress updates. See https://docs.truevault.com/blobs#read-a-blob.
   * @param vaultId vault that contains the blob.
   * @param blobId the ID of the blob being read
   * @param progressCallback callback for XHR's `progress` and `load` events.
   * @returns
   */
  getBlobWithProgress(
    vaultId: string,
    blobId: string,
    progressCallback: Function
  ): Promise<Object>;
  /**
   * Get a BLOB's contents. See https://docs.truevault.com/blobs#read-a-blob.
   * @param vaultId the vault containing the BLOB.
   * @param blobId id of the BLOB.
   * @returns
   */
  getBlob(vaultId: string, blobId: string): Promise<any>;
  /**
   * List the BLOBs in a vault. See https://docs.truevault.com/blobs#list-all-blobs.
   * @param vaultId the vault to list.
   * @param page if paginating, the page.
   * @param perPage if paginating, the number of items per page.
   * @returns
   */
  listBlobs(vaultId: string, page?: number, perPage?: number): Promise<Object>;
  /**
   * Update a BLOB's contents. See https://docs.truevault.com/blobs#update-a-blob.
   * @param vaultId the vault containing the BLOB.
   * @param blobId id of the BLOB.
   * @param file the BLOB's contents.
   * @param ownerId the new BLOB owner.
   * @returns
   */
  updateBlob(
    vaultId: string,
    blobId: string,
    file: File | Blob,
    ownerId?: string | null
  ): Promise<Object>;
  /**
   * Update a BLOB's owner. See https://docs.truevault.com/blobs#update-a-blob-s-owner.
   * @param vaultId the vault containing the BLOB.
   * @param blobId id of the BLOB.
   * @param ownerId the new BLOB owner, or '' to remove owner.
   * @returns
   */
  updateBlobOwner(
    vaultId: string,
    blobId: string,
    ownerId: string
  ): Promise<Object>;
  /**
   * Delete a BLOB. See https://docs.truevault.com/blobs#delete-a-blob.
   * @param vaultId the vault containing the BLOB.
   * @param blobId the BLOB to delete.
   * @returns
   */
  deleteBlob(vaultId: string, blobId: string): Promise<Object>;
  /**
   * Send an email to a user via Sendgrid. See https://docs.truevault.com/email#email-a-user.
   * @param sendgridApiKey Sendgrid API key.
   * @param userId the user to send to.
   * @param sendgridTemplateId the Sendgrid template to use.
   * @param fromEmailSpecifier the specifier for the "From" address. See https://docs.truevault.com/email#value-specifiers.
   * @param toEmailSpecifier the specifier for the "To" address. See https://docs.truevault.com/email#value-specifiers.
   * @param substitutions substitutions to use in the template. See https://docs.truevault.com/email#template-substitution.
   * @returns
   */
  sendEmailSendgrid(
    sendgridApiKey: string,
    userId: string,
    sendgridTemplateId: string,
    fromEmailSpecifier: string,
    toEmailSpecifier: string,
    substitutions: Object
  ): Promise<String>;
  /**
   * Send an SMS message to a user via Twilio.
   * @param twilioAccountSid Twilio Account Sid. See https://www.twilio.com/console
   * @param twilioKeySid Twilio Key Sid. See https://www.twilio.com/docs/api/rest/keys
   * @param twilioKeySecret Twilio Key Secret. See https://www.twilio.com/docs/api/rest/keys
   * @param userId the user to send to.
   * @param fromNumberSpecifier the specifier for the "From" phone number. See https://docs.truevault.com/email#value-specifiers.
   * @param toNumberSpecifier the specifier for the "To" phone number. See https://docs.truevault.com/email#value-specifiers.
   * @param messageBody The text to send in the body of the message
   * @param mediaURLs Optional array of value specifiers producing URLs of images to include in the message. See https://docs.truevault.com/email#value-specifiers.
   * @returns
   */
  sendSMSTwilio(
    twilioAccountSid: string,
    twilioKeySid: string,
    twilioKeySecret: string,
    userId: string,
    fromNumberSpecifier: string,
    toNumberSpecifier: string,
    messageBody: Object,
    mediaURLs: any[]
  ): Promise<String>;
  /**
   * Create a password reset flow. See https://docs.truevault.com/PasswordResetFlow.html.
   * @param name name of this flow
   * @param sendGridTemplateId SendGrid template id to use when sending password reset emails
   * @param sendGridApiKey SendGrid API key
   * @param userEmailValueSpec Value specifier for the "To" address. See https://docs.truevault.com/email#value-specifiers.
   * @param fromEmailValueSpec Value specifier for the "From" address. See https://docs.truevault.com/email#value-specifiers.
   * @param substitutions substitutions to use in the template. See https://docs.truevault.com/email#template-substitution.
   * @returns
   */
  createPasswordResetFlow(
    name: string,
    sendGridTemplateId: string,
    sendGridApiKey: string,
    userEmailValueSpec: Object,
    fromEmailValueSpec: Object,
    substitutions: Object
  ): Promise<Object>;
  /**
   * List password reset flows. See https://docs.truevault.com/PasswordResetFlow.html.
   * @returns
   */
  listPasswordResetFlows(): Promise<Object>;
  /**
   * Send a password reset email to a user. See https://docs.truevault.com/PasswordResetFlow.html.
   * @param flowId the flow to use to send a password reset email
   * @param username
   * @returns
   */
  sendPasswordResetEmail(flowId: string, username: string): Promise<undefined>;
  /**
   * Link a Scoped Access Token to a Password Reset Flow. See https://docs.truevault.com/passwordresetflow#link-a-scoped-access-token-to-a-password-reset-flow
   * @param flowId
   * @param tokenId
   * @returns
   */
  linkScopedAccessTokenToPasswordResetFlow(
    flowId: string,
    tokenId: string
  ): Promise<undefined>;
  /**
   * Create a new Scoped Access Token. See: https://docs.truevault.com/scopedaccesstokens#create-a-scoped-access-token
   * @param name
   * @param policy See https://docs.truevault.com/groups for policy definition documentation
   * @param notValidAfter notValidAfter optional parameter specifying when the returned access token expires
   * @param allowedUses allowedUses optional parameter specifying number of allowed uses
   * @returns
   */
  createScopedAccessToken(
    name: string,
    policy: any[],
    notValidAfter?: Date,
    allowedUses?: number
  ): Promise<Object>;
  /**
   * Get a Scoped Access Token. See https://docs.truevault.com/scopedaccesstokens#get-a-scoped-access-token
   * @param tokenId the token to get
   * @returns
   */
  getScopedAccessToken(tokenId: string): Promise<Object>;
  /**
   * List all Scoped Access Tokens. See https://docs.truevault.com/scopedaccesstokens#list-scoped-access-tokens
   * @returns
   */
  listScopedAccessTokens(): Promise<[object, Object]>;
  /**
   * Delete a Scoped Access Token. See https://docs.truevault.com/scopedaccesstokens#delete-a-scoped-access-token
   * @param tokenId the token to delete
   * @returns
   */
  deleteScopedAccessToken(tokenId: string): Promise<undefined>;
}

/** A file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system. */
interface Blob {
  readonly size: number;
  readonly type: string;
  slice(start?: number, end?: number, contentType?: string): Blob;
}

/** Provides information about files and allows JavaScript in a web page to access their content. */
interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
