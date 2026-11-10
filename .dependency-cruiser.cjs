module.exports = {
    forbidden: [
        {
            name: "no-circular",
            severity: "error",
            from: {},
            to: {
                circular: true
            }
        },
        {
            name: "no-cross-mfe-import",
            severity: "error",
            from: {
                path: "^shell/js/"
            },
            to: {
                path: "^mfe_(cadastro_u|personalizacao_u)/js/"
            }
        }
    ]
};