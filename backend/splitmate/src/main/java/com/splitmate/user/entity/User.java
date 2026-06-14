package com.splitmate.user.entity;

import com.splitmate.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
}