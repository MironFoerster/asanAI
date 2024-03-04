import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';
import { isSpaceMemberGuard } from './guards/is-space-member.guard';
import { notAuthenticatedGuard } from './guards/not-authenticated.guard';
import { newLabGuard } from './guards/new-lab.guard';
import { hasLabAccessGuard } from './guards/has-lab-access.guard';

export const routes: Routes = [
    {path: "",
    loadComponent: () => import("./home/home.component").then((m) => m.HomeComponent),
    children: [
        {path: "",
        loadComponent: () => import("./landing/landing.component").then((m) => m.LandingComponent)},
        {path: "labs",
        loadComponent: () => import("./browse/browse.component").then((m) => m.BrowseComponent),
        data: {"tab": "labs"}},
        {path: "datasets",
        loadComponent: () => import("./browse/browse.component").then((m) => m.BrowseComponent),
        data: {"tab": "pipes"}},
        {path: "models",
        loadComponent: () => import("./browse/browse.component").then((m) => m.BrowseComponent),
        data: {"tab": "models"}},
        {path: "lessons",
        loadComponent: () => import("./browse/browse.component").then((m) => m.BrowseComponent),
        data: {"tab": "lessons"}},
    ]},

    {path: "signin",
    loadComponent: () => import("./signin/signin.component").then((m) => m.default),
    canActivate: [notAuthenticatedGuard]},

    {path: "signup",
    loadComponent: () => import("./signup/signup.component").then((m) => m.SignupComponent),
    canActivate: [notAuthenticatedGuard]},

    {path: "dashboard",
    loadComponent: () => import("./dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [isAuthenticatedGuard]},

    {path: "space/:spaceId",
    loadComponent: () => import("./space/space.component").then((m) => m.SpaceComponent),
    canActivate: [isAuthenticatedGuard, isSpaceMemberGuard]},

    {path: "lab/:labId",
    loadComponent: () => import("./lab/lab.component").then((m) => m.LabComponent),
    canActivate: [isAuthenticatedGuard, hasLabAccessGuard]},

    {path: "lab",
    loadComponent: () => import("./lab/lab.component").then((m) => m.LabComponent),
    canActivate: [newLabGuard]},
    
    {path: "**",
    loadComponent: () => import("./not-found/not-found.component").then((m) => m.NotFoundComponent)},
];
