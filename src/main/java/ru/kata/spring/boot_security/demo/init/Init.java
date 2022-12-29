package ru.kata.spring.boot_security.demo.init;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.util.List;

@Component
public class Init {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;

    public Init(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
    }

    @PostConstruct
    public void postConstruct() {
        userRepository.save(new User("admin_name", "admin_surname", "admin@email.ru",
                encoder.encode("100"), roleRepository.saveAll(List.of(new Role("ROLE_ADMIN")))));

        userRepository.save(new User("user_name", "user_surname", "user@email.ru",
                encoder.encode("200"), roleRepository.saveAll(List.of(new Role("ROLE_USER")))));
    }
}
