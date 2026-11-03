package com.lifeshield.api;
import com.lifeshield.state.*;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequestMapping("/api")
public class StateController {
 private final UserStateRepository repository;
 private static final Set<String> ALLOWED_KEYS=Set.of("lifeshield_user_profile","lifeshield_daily_log","lifeshield_weekly_history","lifeshield_vaccines","lifeshield_reminders","lifeshield_assessments");
 public StateController(UserStateRepository repository){this.repository=repository;}
 @GetMapping("/health") public Map<String,Object> health(){return Map.of("status","UP","service","LifeShield API","timestamp",Instant.now().toString());}
 @GetMapping("/state") public Map<String,String> getAllState(HttpSession session){
  Long uid=requireUser(session); Map<String,String> out=new LinkedHashMap<>();
  repository.findAllByUserId(uid).forEach(row->out.put(row.getKey(),row.getPayload())); return out;
 }
 @GetMapping("/state/{key}") public Map<String,String> getState(@PathVariable String key,HttpSession s){
  validateKey(key); UserState row=repository.findByUserIdAndKey(requireUser(s),key).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"No saved state for key"));
  return Map.of("key",row.getKey(),"payload",row.getPayload());
 }
 @PutMapping("/state/{key}") public Map<String,Object> saveState(@PathVariable String key,@RequestBody StatePayload body,HttpSession s){
  validateKey(key); if(body==null||body.payload()==null||body.payload().length()>1_000_000) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Payload is required and must be under 1 MB");
  Long uid=requireUser(s); UserState row=repository.findByUserIdAndKey(uid,key).map(old->new UserState(uid,key,body.payload())).orElseGet(()->new UserState(uid,key,body.payload()));
  row=repository.save(row); return Map.of("saved",true,"key",row.getKey(),"updatedAt",row.getUpdatedAt().toString());
 }
 @DeleteMapping("/state/{key}") public Map<String,Object> deleteState(@PathVariable String key,HttpSession s){validateKey(key);repository.deleteByUserIdAndKey(requireUser(s),key);return Map.of("deleted",true,"key",key);}
 private Long requireUser(HttpSession s){Object id=s.getAttribute("userId");if(!(id instanceof Long))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Please log in.");return (Long)id;}
 private void validateKey(String key){if(!ALLOWED_KEYS.contains(key))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unsupported state key");}
 public record StatePayload(@NotBlank String payload){}
}
