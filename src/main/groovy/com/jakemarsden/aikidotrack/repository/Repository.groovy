package com.jakemarsden.aikidotrack.repository

import groovy.transform.PackageScope
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.NoRepositoryBean

@NoRepositoryBean
@PackageScope
interface Repository<T> extends CrudRepository<T, Long> {

    @Override
    <S extends T> List<S> saveAll(Iterable<S> entities);

    @Override
    List<T> findAll();

    @Override
    List<T> findAllById(Iterable<Long> ids);
}
