import React from "react";
import { CreateStore } from "../Components/CreateStore/CreateStore";
import { Customer } from "../Components/Customer/Customer";
import { Login } from "../Components/Login/Login";
import { SiteManager } from "../Components/SiteManager/SiteManager";
import { StoreOwner } from "../Components/StoreOwner/StoreOwner";

import { HashRouter as Router, Route } from "react-router-dom";

export default [
  <Router>
    <Route path="/createstore" component={CreateStore} />
    <Route path="/customer" component={Customer} />
    <Route path="/login" component={Login} />
    <Route path="/sitemanager" component={SiteManager} />
    <Route path="/storeowner" component={StoreOwner} />
  </Router>,
];
