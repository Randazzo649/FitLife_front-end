package com.fitlife.mfe.cadastro.architecture;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

@AnalyzeClasses(packages = "com.fitlife.mfe.cadastro", importOptions = ImportOption.DoNotIncludeTests.class)
class CadastroArchitectureTest {
    @ArchTest
    static final ArchRule controllers_must_not_access_clients = noClasses()
            .that().resideInAPackage("..bff.controller..")
            .should().dependOnClassesThat().resideInAPackage("..bff.client..");

    @ArchTest
    static final ArchRule dto_and_web_layers_must_not_depend_on_bff_implementation = noClasses()
            .that().resideInAnyPackage("..bff.dto..", "..web.controller..")
            .should().dependOnClassesThat().resideInAnyPackage("..bff.client..", "..bff.service..");

    @ArchTest
    static final ArchRule packages_must_be_free_of_cycles = slices()
            .matching("com.fitlife.mfe.cadastro.(*)..")
            .should().beFreeOfCycles();
}
