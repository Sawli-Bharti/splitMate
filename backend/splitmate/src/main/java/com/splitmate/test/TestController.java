package com.splitmate.test;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @PostMapping
    public String test(@RequestBody String body) {

        System.out.println("TEST HIT");
        System.out.println(body);

        return "OK";
    }
}