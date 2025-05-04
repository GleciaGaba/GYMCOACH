package com.gymcoach.backend_gym.security;

import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.UserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepo;
    public UserDetailsServiceImpl(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));
            List<GrantedAuthority> auths = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole())
            );
                return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), auths
    );
    }
}
