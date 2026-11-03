package com.lifeshield.state;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "app_state")
public class AppState {
    @Id
    @Column(name = "state_key", length = 120, nullable = false)
    private String key;

    @Column(name = "payload", columnDefinition = "text", nullable = false)
    private String payload;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public AppState() {}
    public AppState(String key, String payload) { this.key = key; this.payload = payload; this.updatedAt = Instant.now(); }
    @PrePersist @PreUpdate public void touch() { updatedAt = Instant.now(); }
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
