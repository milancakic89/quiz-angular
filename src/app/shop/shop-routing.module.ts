import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ShopComponent } from "./shop.component";

const routes: Route[] = [
    {path: '', component: ShopComponent, data: {showNavigation: true}}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShopRoutingModule {}