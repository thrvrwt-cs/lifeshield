package com.lifeshield.auth;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="app_users")
public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false, unique=true, length=320) private String email;
 @Column(nullable=false, length=100) private String name;
 @Column(nullable=false, length=100) private String passwordHash;
 @Column(nullable=false) private Instant createdAt=Instant.now();
 public AppUser() {}
 public AppUser(String name,String email,String passwordHash){this.name=name;this.email=email;this.passwordHash=passwordHash;}
 public Long getId(){return id;} public String getEmail(){return email;} public String getName(){return name;}
 public String getPasswordHash(){return passwordHash;}
}
