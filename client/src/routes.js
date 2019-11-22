/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import { Home, TrendingUp, EuroSymbol, Store, ShoppingCart } from "@material-ui/icons";

// core components/views for Admin layout
import { Overview, Financial, Sales, Inventory, Purchases } from './views/';

const dashboardRoutes = [
  {
    path: "/overview",
    name: "Overview",
    icon: Home,
    component: Overview,
    layout: "/admin"
  },
  {
    path: "/financial",
    name: "Financial",
    icon: TrendingUp,
    component: Financial,
    layout: "/admin"
  },
  {
    path: "/sales",
    name: "Sales",
    icon: EuroSymbol,
    component: Sales,
    layout: "/admin"
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: Store,
    component: Inventory,
    layout: "/admin"
  },
  {
    path: "/purchases",
    name: "Purchases",
    icon: ShoppingCart,
    component: Purchases,
    layout: "/admin"
  },
];

export default dashboardRoutes;
