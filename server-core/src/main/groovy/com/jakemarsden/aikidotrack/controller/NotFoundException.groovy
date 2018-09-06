package com.jakemarsden.aikidotrack.controller

import groovy.transform.PackageScope
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NOT_FOUND)
@PackageScope
class NotFoundException extends RuntimeException {

    NotFoundException(String msg) {
        super(msg)
    }

    NotFoundException(Throwable cause) {
        super(cause)
    }

    NotFoundException(String msg, Throwable cause) {
        super(msg, cause)
    }
}
