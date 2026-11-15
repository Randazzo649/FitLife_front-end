package com.fitlife.mfe.comunidade.architecture;
import com.tngtech.archunit.core.importer.ImportOption;import com.tngtech.archunit.junit.AnalyzeClasses;import com.tngtech.archunit.junit.ArchTest;import com.tngtech.archunit.lang.ArchRule;import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;
@AnalyzeClasses(packages="com.fitlife.mfe.comunidade",importOptions=ImportOption.DoNotIncludeTests.class)
class MfeComunidadeUArchitectureTest {
 @ArchTest static final ArchRule bff_controllers_nao_acessam_clients=noClasses().that().resideInAPackage("..bff.controller..").should().dependOnClassesThat().resideInAPackage("..bff.client..");
 @ArchTest static final ArchRule pacotes_sem_ciclos=slices().matching("com.fitlife.mfe.comunidade.(*)..").should().beFreeOfCycles();
}
