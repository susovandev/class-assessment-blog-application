import {Router} from "express";
import {
  aboutPage,
  blogPage,
  contactPage,
  indexPage,
  pricingPage,
  portfolioDetailsPage,
  portfolioPage,
  servicesPage,
  singleBlogPage,
  teamPage,
  testimonialsPage,
} from "../../controllers/frontend/frontend.controller.js";
const router = Router();

router.get("/", indexPage);
router.get("/about", aboutPage);
router.get("/blog-single", singleBlogPage);
router.get("/blog", blogPage);
router.get("/contact", contactPage);
router.get("/portfolio-details", portfolioDetailsPage);
router.get("/portfolio", portfolioPage);
router.get("/pricing", pricingPage);
router.get("/services", servicesPage);
router.get("/team", teamPage);
router.get("/testimonials", testimonialsPage);

export default router;
