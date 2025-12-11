import express, { urlencoded } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { mainRouter } from './routes/main.routes';
import helmet from 'helmet';
import { adminRouter } from './routes/admin.routes';
import { authRouter } from './routes/auth.routes';
import passport from 'passport';
import { LocalStrategy } from './auth/strategies/passport_local';
import { JWTStrategy } from './auth/strategies/passport_jwt';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import fs from 'fs';

let cachedSpec: any = null;

const server = express();
server.use(helmet());
server.use(cors());
server.use(urlencoded({ extended: true }));
server.disable('x-powered-by');
server.use(express.json());

passport.use(JWTStrategy);
passport.use(LocalStrategy);
server.use(passport.initialize());

server.use('/api', mainRouter);
server.use('/api/admin', adminRouter);
server.use('/api/auth', authRouter);

const getOpenAPISpec = () => {
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev && cachedSpec) return cachedSpec;
    const raw = fs.readFileSync('src/openapi.yaml', 'utf-8');
    cachedSpec = yaml.parse(raw);
    return cachedSpec
}
server.use('/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
        swaggerOptions: {
            spec: getOpenAPISpec()
        }
    })
)

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
})
