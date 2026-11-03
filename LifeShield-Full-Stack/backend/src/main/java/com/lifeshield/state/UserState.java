package com.lifeshield.state;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="user_state", uniqueConstraints=@UniqueConstraint(columnNames={"user_id","state_key"}))
public class UserState {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="user_id",nullable=false) private Long userId;
 @Column(name="state_key",nullable=false,length=120) private String key;
 @Column(name="payload",columnDefinition="text",nullable=false) private String payload;
 @Column(name="updated_at",nullable=false) private Instant updatedAt=Instant.now();
 public UserState(){} public UserState(Long userId,String key,String payload){this.userId=userId;this.key=key;this.payload=payload;this.updatedAt=Instant.now();}
 public void setPayload(String payload){this.payload=payload;this.updatedAt=Instant.now();} public Long getId(){return id;} public Long getUserId(){return userId;} public String getKey(){return key;} public String getPayload(){return payload;} public Instant getUpdatedAt(){return updatedAt;}
}
