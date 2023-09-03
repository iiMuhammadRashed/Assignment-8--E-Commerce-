import brandRouter from './modules/brand/brand.routes.js';
import categoryRouter from './modules/category/category.routes.js';
import productRouter from './modules/product/product.routes.js';
import subCategoryRouter from './modules/subCategory/subCategory.routes.js';
import userRouter from './modules/user/user.routes.js';
import morgan from 'morgan';
import { AppError } from './utils/AppError.js';

export function bootstrap(app, express) {
  app.use(morgan('dev'));

  // Static Files
  app.use(express.static('public'));
  app.use('/css', express.static('public/css'));
  app.use('/images', express.static('public/images'));
  app.use('/js', express.static('public/js'));

  // Set View
  app.set('views', './views');
  app.set('view engine', 'ejs');
  app.get('/', (req, res) => {
    res.render('index');
  });

  // APIs Endpoints
  app.use(express.json());
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/subCategories', subCategoryRouter);
  app.use('/api/v1/brands', brandRouter);
  app.use('/api/v1/products', productRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/auth', userRouter);
  app.all('*', (req, res, next) => {
    next(new AppError(`Invalid endpoint ${req.originalUrl}`, 404));
  });
}
