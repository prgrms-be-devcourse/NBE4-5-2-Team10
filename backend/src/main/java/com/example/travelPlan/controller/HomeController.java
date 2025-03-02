package com.example.travelPlan.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {
    @RequestMapping(value="/main")
    @ResponseBody
    public String main(){
        return "hello world";
    }
}
