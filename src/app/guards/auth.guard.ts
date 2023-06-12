import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { take, tap } from "rxjs";


export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn().pipe(
    take(1),
    tap((isLoggedIn) =>
      !isLoggedIn ? router.navigate(["/login"]) : true
    )
  );
  
}