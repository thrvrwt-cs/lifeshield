package com.lifeshield.auth;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.*;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AppUserRepository users;
 private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
 public AuthController(AppUserRepository users){this.users=users;}
 @PostMapping("/register") public Map<String,Object> register(@RequestBody RegisterRequest r, HttpSession session){
  if(r.name()==null || r.name().isBlank() || r.email()==null || !r.email().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") || r.password()==null || r.password().length()<8)
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Enter a name, valid email and password with at least 8 characters.");
  String email=r.email().trim().toLowerCase();
  if(users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT,"An account with this email already exists.");
  AppUser u=users.save(new AppUser(r.name().trim(),email,encoder.encode(r.password())));
  session.setAttribute("userId",u.getId()); session.setAttribute("userEmail",u.getEmail());
  return Map.of("name",u.getName(),"email",u.getEmail());
 }
 @PostMapping("/login") public Map<String,Object> login(@RequestBody LoginRequest r,HttpSession session){
  if(r.email()==null||r.password()==null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email and password are required.");
  AppUser u=users.findByEmailIgnoreCase(r.email().trim()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password."));
  if(!encoder.matches(r.password(),u.getPasswordHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password.");
  session.setAttribute("userId",u.getId()); session.setAttribute("userEmail",u.getEmail());
  return Map.of("name",u.getName(),"email",u.getEmail());
 }
 @GetMapping("/me") public Map<String,Object> me(HttpSession s){
  Object id=s.getAttribute("userId"); if(id==null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Please log in.");
  return Map.of("name",users.findById((Long)id).orElseThrow().getName(),"email",s.getAttribute("userEmail"));
 }
 @PostMapping("/logout") public Map<String,Object> logout(HttpSession s){s.invalidate();return Map.of("loggedOut",true);}
 public record RegisterRequest(@NotBlank String name,@NotBlank String email,@NotBlank String password){}
 public record LoginRequest(@NotBlank String email,@NotBlank String password){}
}
