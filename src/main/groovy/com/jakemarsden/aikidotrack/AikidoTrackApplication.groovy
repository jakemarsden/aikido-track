package com.jakemarsden.aikidotrack

import groovy.util.logging.Slf4j
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder

@SpringBootApplication
@Slf4j
class AikidoTrackApplication implements ApplicationRunner {

    static void main(String[] args) {
        new SpringApplicationBuilder()
                .sources(AikidoTrackApplication)
                .run(args)
    }

    @Override
    void run(ApplicationArguments args) {
        log.info "run: args=$args.sourceArgs"
    }
}
