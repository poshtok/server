"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const http_1 = require("http");
const schema_1 = require("@graphql-tools/schema");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_core_1 = require("apollo-server-core");
const graphql_depth_limit_1 = __importDefault(require("graphql-depth-limit"));
const formatError_1 = __importDefault(require("./utils/lib/formatError"));
const db_1 = __importDefault(require("./utils/lib/db"));
const preLunchSignup_1 = __importDefault(require("./services/preLunchSignup"));
const contactUs_1 = __importDefault(require("./services/contactUs"));
const schema_2 = require("./schema");
const datasources_1 = __importDefault(require("./datasources"));
const auth_1 = __importDefault(require("./utils/lib/auth"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, compression_1.default)());
        app.use((0, cors_1.default)());
        app.use(express_1.default.json({ limit: "100mb" }));
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(auth_1.default);
        app.post("/contactus", contactUs_1.default);
        app.post("/prelunchsignup", preLunchSignup_1.default);
        app.get("/test", (req, res) => {
            return res.send("it's working");
        });
        const httpServer = (0, http_1.createServer)(app);
        const schema = (0, schema_1.makeExecutableSchema)({
            typeDefs: schema_2.typeDefs,
            resolvers: schema_2.resolvers,
        });
        const server = new apollo_server_express_1.ApolloServer({
            schema,
            context: ({ req, res }) => ({
                res,
                req,
                dataSources: datasources_1.default,
                engine: {
                    reportSchema: true
                },
            }),
            validationRules: [(0, graphql_depth_limit_1.default)(7)],
            csrfPrevention: true,
            cache: "bounded",
            plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true })],
            formatError: formatError_1.default,
            introspection: true
        });
        yield server.start();
        server.applyMiddleware({ app, path: "/", cors: false });
        db_1.default.connect(process.env.DB_URL);
        const PORT = process.env.PORT;
        httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`));
    });
})();
