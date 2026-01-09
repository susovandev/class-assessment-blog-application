import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import frontendRoutes from './frontend/frontend.routes.js';
export default function configureRoutes(app) {
	app.use('/auth', authRoutes);
	app.use('/user', userRoutes);
	app.use(frontendRoutes);
}
