import loadable from '@loadable/component'
import { Spinner } from '../components';



const SignIn = loadable(()=> import("./auth/pages/sign-in"), {fallback: <Spinner/>})
const SignUp = loadable(()=> import("./auth/pages/sign-up"), {fallback: <Spinner/>})
const Admin = loadable(()=> import("./admin-layout"), {fallback: <Spinner/>})
const Products = loadable(()=> import("./products/pages/products"), {fallback: <Spinner/>})
const Category = loadable(()=> import("./category/pages"), {fallback: <Spinner/>})
const Brands = loadable(()=> import("./brand/pages"), {fallback: <Spinner/>})

export {
    SignIn,
    SignUp,
    Admin,
    Products,
    Category,
    Brands
}