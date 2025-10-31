enum INVOICE {
    CREATE = 'invoice.create',
    GET_BY_ID = 'invoice.get_by_id',
    UPDATE_BY_ID = 'invoice.update_by_id',
    DELETE_BY_ID = 'invoice.delete_by_id',
    SEND = 'invoice.send',
}

enum PRODUCT {
    CREATE = 'product.create',
    GET_LIST = 'product.get_list',
}

enum USER {
    CREATE = 'user.create',
    GET_ALL = 'user.get_all',
    GET_BY_USER_ID = 'user.get_by_user_id',
}

enum KEYCLOAK {
    CREATE_USER = 'keycloak.create_user',
}

enum AUTHORIZER {
    LOGIN = 'authorizer.login',
    VERIFY_USER_TOKEN = 'authorizer.verify_user_token',
}

enum PDF_GENERATOR {
    CREATE_INVOICE_PDF = 'pdf_generator.create_invoice_pdf',
}
export const TCP_REQUEST_MESSAGE = {
    INVOICE,
    PRODUCT,
    USER,
    KEYCLOAK,
    AUTHORIZER,
    PDF_GENERATOR,
};
