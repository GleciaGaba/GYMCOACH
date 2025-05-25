// src/main/java/com/gymcoach/backend_gym/dto/SignupRequest.java
package com.gymcoach.backend_gym.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
  @NotBlank @Email
  private String email;

  @NotBlank @Size(min = 12)
  private String password;

  @NotBlank(message = "Le prénom est requis")
  private String firstName;

  @NotBlank(message = "Le nom de famille est requis")
  private String lastName;

  
}
