package ma.YassineGroup.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class webAppController {
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/kontakt")
    public String kontakt() {
        return "kontakt";
    }

    @GetMapping("/impressum")
    public String indexStatus() {
        return "impressum";
    }
}


