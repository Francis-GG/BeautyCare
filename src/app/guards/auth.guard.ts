import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { take, tap } from "rxjs";
import { NavigationService } from "../services/navigation.service";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const navigationService = inject(NavigationService);

  if (route.url.toString() === 'calendario' && !navigationService.hasClickedRedirect) {
    // if the user is trying to access /calendario without clicking the redirect, send them to /servicios
    return router.parseUrl('/servicios/depilacion');
  }

  return auth.isLoggedIn().pipe(
    take(1),
    tap((isLoggedIn) =>
      !isLoggedIn ? router.navigate(["/login"]) : true
    )
  );
}






