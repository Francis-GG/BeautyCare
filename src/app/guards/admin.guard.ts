import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { take, tap } from "rxjs";

export const adminGuard: CanActivateChildFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAdmin().pipe(
    take(1),
    tap((isAdmin) =>
      !isAdmin ? router.navigate(["/"]) : true
    )
  );
}