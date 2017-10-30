-- SQL Manager for PostgreSQL 5.7.0.46919
-- ---------------------------------------
-- Host      : localhost
-- Database  : datos_indicadores
-- Version   : PostgreSQL 9.6.5, compiled by Visual C++ build 1800, 64-bit



CREATE SCHEMA "Datawarehouse" AUTHORIZATION postgres;
--
-- Definition for function fun_actua_formacion (OID = 19400) : 
--
SET search_path = "Datawarehouse", pg_catalog;
SET check_function_bodies = false;
CREATE FUNCTION "Datawarehouse".fun_actua_formacion (
)
RETURNS trigger
AS 
$body$
DECLARE
  cantidad_f INTEGER;
BEGIN
  SELECT Count(*) INTO cantidad_f FROM "Datawarehouse"."KPI_Formacion" fk WHERE fk.formacion = new.formacion 
  AND fk.anio=new.anio;
	IF cantidad_f > 0 THEN
    	DELETE  FROM "Datawarehouse"."KPI_Formacion" fk WHERE fk.formacion = new.formacion  AND fk.anio=new.anio;
   END IF;  
   return new;
 END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function fun_actua_relacion (OID = 19401) : 
--
CREATE FUNCTION "Datawarehouse".fun_actua_relacion (
)
RETURNS trigger
AS 
$body$
DECLARE
  cantidad_r INTEGER;
BEGIN
  SELECT Count(*) INTO cantidad_r FROM "Datawarehouse"."KPI_Relacion_Docentes" fk WHERE fk.anio = new.anio;
	IF cantidad_r < 1 THEN
    	insert into "Datawarehouse"."KPI_Relacion_Docentes" values (new.anio,new.t_completo,new.hora_catedra,new.t_completo);
 	ELSE 
    	UPDATE "Datawarehouse"."KPI_Relacion_Docentes" SET cant_docentes_tc = ( select sum(t_completo)  from "Datawarehouse"."KPI_Formacion" where anio=new.anio),
    cant_docentes_hc = ( select sum(hora_catedra)  from "Datawarehouse"."KPI_Formacion" where anio=new.anio),relacion_docentes =  (select (sum(hora_catedra)::FLOAT/sum(t_completo)::FLOAT)::numeric(5,2) from "Datawarehouse"."KPI_Formacion" where anio=new.anio) WHERE anio=new.anio;

   END IF;  
   return new;
 END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function fun_delete_cohort (OID = 19402) : 
--
CREATE FUNCTION "Datawarehouse".fun_delete_cohort (
)
RETURNS trigger
AS 
$body$
DECLARE
 cantidad_c INTEGER;
BEGIN
  SELECT COUNT(*) INTO cantidad_c FROM "Datawarehouse"."KPI_Desercion_Cohorte" ds WHERE ds.programa = NEW.programa AND ds.periodo = NEW.periodo;
  IF cantidad_c > 0 THEN
  	DELETE FROM "Datawarehouse"."KPI_Desercion_Cohorte" ds WHERE ds.programa = NEW.programa AND ds.periodo = NEW.periodo;
   END IF;
    return new;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function fun_delete_period (OID = 19403) : 
--
CREATE FUNCTION "Datawarehouse".fun_delete_period (
)
RETURNS trigger
AS 
$body$
DECLARE
	cantidad_p INTEGER;
BEGIN
  SELECT COUNT(*) INTO cantidad_p FROM "Datawarehouse"."KPI_Desercion_Periodo" dp WHERE dp.programa = NEW.programa AND dp.periodo = NEW.periodo;
  IF cantidad_p > 0 THEN
  	DELETE FROM "Datawarehouse"."KPI_Desercion_Periodo" dp WHERE dp.programa = NEW.programa AND dp.periodo = NEW.periodo;
  END IF;
  RETURN NEW;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function Actua_Estudiantes_Dep (OID = 19404) : 
--
SET search_path = public, pg_catalog;
CREATE FUNCTION public."Actua_Estudiantes_Dep" (
)
RETURNS trigger
AS 
$body$
DECLARE
  cantidad_e INTEGER;
BEGIN
  SELECT Count(*) INTO cantidad_e FROM estudiantes_departamento ek WHERE ek.departamento = new.departamento and ek.anho=NEW.anho and ek.periodo=new.periodo;
	IF cantidad_e > 0 THEN
    	DELETE  FROM estudiantes_departamento ek WHERE ek.departamento = new.departamento and ek.anho=NEW.anho and ek.periodo=new.periodo;
   	END IF;  
   	return new;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function Actua_Formacion_Dep (OID = 19405) : 
--
CREATE FUNCTION public."Actua_Formacion_Dep" (
)
RETURNS trigger
AS 
$body$
DECLARE
  cantidad_f INTEGER;
BEGIN
  SELECT Count(*) INTO cantidad_f FROM formacion_departamento fk WHERE fk.departamento = new.departamento and fk.anio=NEW.anio and fk.periodo=new.periodo and fk.formacion=new.formacion;
	IF cantidad_f > 0 THEN
    	DELETE  FROM formacion_departamento fk WHERE fk.departamento = new.departamento and fk.anio=NEW.anio and fk.periodo=new.periodo and fk.formacion=new.formacion;
   	END IF;  
   	return new;
 END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function Fun_Actua_KPI_Est_Doc (OID = 19406) : 
--
CREATE FUNCTION public."Fun_Actua_KPI_Est_Doc" (
)
RETURNS trigger
AS 
$body$
DECLARE
  cantidad_e INTEGER;
BEGIN
	SELECT Count(*) INTO cantidad_e FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" ek WHERE ek."Anho"=NEW.anho AND ek.departamento=NEW.departamento;
		/*IF NEW.departamento<>'99' THEN*/
			IF cantidad_e < 1 THEN
				IF NEW.periodo='1' THEN
					INSERT INTO "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" (departamento,"Anho",estudiantes,docentes,razona,razonanual) 
						SELECT 
							t2.departamento, 
							t1.anho, 
							t1.ea::numeric(5,0),
							t2.da::numeric(3,0),
							t1.ea/t2.da::numeric(3,0),
							t1.ea/t2.da::numeric(3,0)
						FROM ( 
							SELECT anho,matriculados AS ea
							FROM estudiantes_departamento 
							WHERE 
								periodo = NEW.periodo 
							AND 
								anho = NEW.anho 
							AND 
								departamento = NEW.departamento) t1
						JOIN ( 
							SELECT anio,departamento,sum(t_completo) AS da
							FROM formacion_departamento 
							WHERE
								periodo = NEW.periodo 
							AND 
								anio=NEW.anho 
							AND
								departamento = NEW.departamento 
							GROUP BY anio,departamento) t2 
						ON t2.departamento=NEW.departamento
						ORDER BY t1.anho;
				ELSE
					INSERT INTO "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" (departamento,"Anho",estudiantes,docentes,razonb,razonanual) 
						SELECT 
							t2.departamento,
							t1.anho, 
							t1.eb::numeric(5,0),
							t2.db::numeric(3,0),
							t1.eb/t2.db::numeric(3,0),
							t1.eb/t2.db::numeric(3,0)
						FROM ( 
							SELECT anho,matriculados AS eb
							FROM estudiantes_departamento 
							WHERE 
								periodo = NEW.periodo 
							AND 
								anho = NEW.anho
							AND 
								departamento = NEW.departamento) t1
						JOIN ( 
							SELECT anio,departamento,sum(t_completo) AS db
							FROM formacion_departamento 
							WHERE 
								periodo = NEW.periodo 
							AND 
								anio=NEW.anho 
							AND 
								departamento=NEW.departamento 
							GROUP BY anio,departamento) t2 
						ON t2.departamento=NEW.departamento
						ORDER BY t1.anho;
				END IF;
			ELSE
                  IF NEW.periodo='2' THEN
                      UPDATE "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" 
                          SET 
                              estudiantes=(
                                  SELECT 
                                      sum(matriculados)/2::numeric(5,0)
                                  FROM estudiantes_departamento 
                                  WHERE 
                                      anho=NEW.anho
                                  AND 
                                      departamento=NEW.departamento),
                              docentes=(
                                  SELECT 
                                      sum(t_completo)/2::numeric(3,0)
                                  FROM formacion_departamento 
                                  WHERE 
                                      anio=NEW.anho
                                  AND 
                                      departamento=NEW.departamento)
                          WHERE 
                              "Anho"=new.anho
                          AND
                              departamento=NEW.departamento;
                      UPDATE "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" 
                          SET 
                              razonanual=(
                                  SELECT 
                                      estudiantes/docentes::numeric(3,0)
                                  FROM 
                                      "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC"
                                  WHERE
                                      "Anho"=NEW.anho
                                  AND 
                                      departamento=NEW.departamento)
                          WHERE 
                              "Anho"=new.anho
                          AND
                              departamento=NEW.departamento;
                      UPDATE "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" 
                          SET 
                              razonb=(
                                  SELECT 
                                      (2*razonanual-razona)::numeric(3,0)
                                  FROM 
                                      "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC"
                                  WHERE
                                      "Anho"=NEW.anho
                                  AND 
                                      departamento=NEW.departamento)
                          WHERE 
                              "Anho"=new.anho
                          AND
                              departamento=NEW.departamento;
                  END IF;
			END IF;
		/*END IF;*/
	return NEW;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function Fun_Actua_KPI_Form (OID = 19407) : 
--
CREATE FUNCTION public."Fun_Actua_KPI_Form" (
)
RETURNS trigger
AS 
$body$
DECLARE
  cantidad_f INTEGER;
BEGIN
	SELECT Count(*) INTO cantidad_f FROM "Datawarehouse"."KPI_Formacion" fk WHERE fk.formacion = new.formacion AND fk.anio=new.anio;
    IF cantidad_f < 1 THEN
    	IF new.periodo = '2' THEN        
          INSERT INTO "Datawarehouse"."KPI_Formacion" (formacion,t_completo,t_ocasional,hora_catedra,anio) select formacion,sum(t_completo),sum(t_ocasional),sum(hora_catedra),anio from formacion_departamento where formacion = new.formacion AND anio=new.anio group by formacion,anio;
          update "Datawarehouse"."KPI_Formacion" set estado_meta=(select ((select sum(t_completo) from "Datawarehouse"."KPI_Formacion" join formacion on formacion=cod_formacion where nom_formacion in ('Doctor','Magíster') and anio=new.anio)::FLOAT/(select sum(t_completo)from "Datawarehouse"."KPI_Formacion" where anio=new.anio)::FLOAT)::numeric(5,2) *100) WHERE anio=new.anio; 	
        END IF;  
    ELSE
    	UPDATE "Datawarehouse"."KPI_Formacion" SET formacion=new.formacion, t_completo = ( select sum(t_completo)  from formacion_departamento where anio=new.anio and formacion=NEW.formacion and periodo='2'),
    	t_ocasional = ( select sum(t_ocasional)  from formacion_departamento where anio=new.anio and formacion=NEW.formacion and periodo='2'),hora_catedra =  (select sum(hora_catedra)  from formacion_departamento where anio=new.anio and formacion=NEW.formacion and periodo='2'), anio=NEW.anio WHERE anio=new.anio and formacion = new.formacion;
        
        update "Datawarehouse"."KPI_Formacion" set estado_meta=(select ((select sum(t_completo) from "Datawarehouse"."KPI_Formacion" join formacion on formacion=cod_formacion where nom_formacion in ('Doctor','Magíster') and anio=new.anio)::FLOAT/(select sum(t_completo)from "Datawarehouse"."KPI_Formacion" where anio=new.anio)::FLOAT)::numeric(5,2) *100) WHERE anio=new.anio; 	
    END IF; 
   return new;
 END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function fun_actua_satisfaccion (OID = 19408) : 
--
CREATE FUNCTION public.fun_actua_satisfaccion (
)
RETURNS trigger
AS 
$body$
DECLARE
  cantidad_f INTEGER;
BEGIN
  SELECT Count(*) INTO cantidad_f FROM "Datawarehouse"."KPI_Nivel_Satisfaccion" ns WHERE ns."Programa" = NEW."Programa" and ns."Anho"=NEW."Anho";
	IF cantidad_f > 0 THEN
    	DELETE  FROM "Datawarehouse"."KPI_Nivel_Satisfaccion" ns WHERE ns."Programa" = NEW."Programa" and ns."Anho"=NEW."Anho";
   	END IF;  
   	return NEW;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function Fun_Actua_KPI_Est_Doc_UDENAR (OID = 19803) : 
--
CREATE FUNCTION public."Fun_Actua_KPI_Est_Doc_UDENAR" (
)
RETURNS trigger
AS 
$body$
DECLARE
  cantidad_eu INTEGER;
BEGIN
	SELECT Count(*) INTO cantidad_eu FROM "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" ek WHERE ek."Anho"=NEW.anho AND ek.departamento='UD';
    /*IF NEW.departamento<>'99' THEN*/
      IF cantidad_eu < 1 THEN
      	IF NEW.periodo='1' THEN
          INSERT INTO "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" (departamento,"Anho",estudiantes,docentes,razonanual,razona) 
            SELECT
            	'UD',
                t1.anho, 
                t1.ea::numeric(5,0),
				t2.da::numeric(3,0),
				t1.ea/t2.da::numeric(3,0),
				t1.ea/t2.da::numeric(3,0)
            FROM ( 
            	SELECT anho,sum(matriculados) AS ea
                FROM estudiantes_departamento 
                WHERE 
                	periodo=NEW.periodo
                AND 
                	anho=NEW.anho
                GROUP BY anho) t1
            JOIN ( 
            	SELECT anio,sum(t_completo) AS da
                FROM formacion_departamento 
                WHERE 
                	periodo=NEW.periodo
                AND 
                	anio=NEW.anho
                GROUP BY anio) t2 
            ON t2.anio=t1.anho
            ORDER BY t1.anho;
        ELSE
			INSERT INTO "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" (departamento,"Anho",estudiantes,docentes,razonb,razonanual) 
				SELECT
                	'UD',
					t1.anho, 
					t1.eb::numeric(5,0),
					t2.db::numeric(3,0),
					t1.eb/t2.db::numeric(3,0),
					t1.eb/t2.db::numeric(3,0)
				FROM ( 
					SELECT anho,matriculados AS eb
					FROM estudiantes_departamento 
					WHERE 
						periodo = NEW.periodo 
					AND 
						anho = NEW.anho
                    GROUP BY anho) t1
				JOIN ( 
					SELECT anio,sum(t_completo) AS db
					FROM formacion_departamento 
					WHERE 
						periodo = NEW.periodo 
					AND 
						anio=NEW.anho 
					GROUP BY anio) t2 
				ON t2.anio=t1.anho
				ORDER BY t1.anho;
        END IF;
      ELSE
      	IF NEW.periodo='2' THEN
        	UPDATE "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" 
            SET 
            	estudiantes=(
                	SELECT 
                    	sum(matriculados)/2::numeric(5,0)
                    FROM estudiantes_departamento 
                    WHERE 
                    	anho=NEW.anho),
                docentes=(
                	SELECT 
                    	SUM(t_completo)/2::numeric(3,0)
                    FROM formacion_departamento 
            		WHERE 
            			anio=NEW.anho)
            WHERE 
            	"Anho"=new.anho
            AND departamento='UD';
			UPDATE "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" 
            SET 
            	razonanual=(
                	SELECT 
                        t1.e/t2.d::numeric(3,0)
                    FROM 
                        (
                        SELECT 
                            anho,
                            sum(matriculados)/2::numeric(5,0) AS e
                        FROM estudiantes_departamento 
                        WHERE 
                            anho=NEW.anho
                        GROUP BY anho) t1
                    JOIN 
                        (
                        SELECT 
                            anio,
                            sum(t_completo)/2::numeric(5,0) AS d
                        FROM formacion_departamento 
                        WHERE 
                            anio=NEW.anho
                        GROUP BY anio) t2
                    ON t1.anho=t2.anio
                    WHERE
                        anio=NEW.anho)
            WHERE 
            	"Anho"=NEW.anho
            AND 
            	departamento='UD';
            UPDATE "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" 
            SET 
            	razonb=(
                	SELECT 
                    	(2*razonanual-razona)::numeric(3,0)
                    FROM 
                    	"Datawarehouse"."KPI_Estudiantes_por_Docentes_TC"
                    WHERE
                    	"Anho"=NEW.anho
                    AND 
                    	departamento='UD')
        	WHERE 
            	"Anho"=new.anho
            AND
                departamento='UD';
      	END IF;
            
      END IF;       
   /*END IF;*/
   return NEW;
 END;
$body$
LANGUAGE plpgsql;
--
-- Structure for table KPI_Acreditacion (OID = 19409) : 
--
SET search_path = "Datawarehouse", pg_catalog;
CREATE TABLE "Datawarehouse"."KPI_Acreditacion" (
    "Anho" char(4),
    acreditados numeric(2,0),
    programas numeric(2,0),
    razon numeric(2,0),
    "manual_Acredita" char(3) DEFAULT 4
)
WITH (oids = false);
--
-- Structure for table KPI_Desercion_Cohorte (OID = 19413) : 
--
CREATE TABLE "Datawarehouse"."KPI_Desercion_Cohorte" (
    programa varchar(6) NOT NULL,
    periodo varchar(7) NOT NULL,
    porcentaje varchar(8),
    manual char(3) DEFAULT 6
)
WITH (oids = false);
--
-- Structure for table KPI_Desercion_Periodo (OID = 19417) : 
--
CREATE TABLE "Datawarehouse"."KPI_Desercion_Periodo" (
    programa varchar(6) NOT NULL,
    periodo varchar(7) NOT NULL,
    no_graduados varchar(5),
    desertores varchar(5),
    desercion varchar(6),
    retencion varchar(6),
    manual char(3) DEFAULT 7
)
WITH (oids = false);
--
-- Structure for table KPI_Estudiantes_por_Docentes_TC (OID = 19421) : 
--
CREATE TABLE "Datawarehouse"."KPI_Estudiantes_por_Docentes_TC" (
    departamento char(2) NOT NULL,
    "Anho" char(4) NOT NULL,
    estudiantes numeric(5,0) NOT NULL,
    docentes numeric(3,0) NOT NULL,
    razonanual numeric(3,0) NOT NULL,
    razona numeric(3,0) NOT NULL,
    razonb numeric(3,0) DEFAULT 0,
    "manual_Estu_Docente" char(3) DEFAULT 5
)
WITH (oids = false);
--
-- Structure for table KPI_Formacion (OID = 19426) : 
--
CREATE TABLE "Datawarehouse"."KPI_Formacion" (
    formacion char(2),
    t_completo integer,
    t_ocasional integer,
    hora_catedra integer,
    anio varchar(5),
    "manual_Formacion" char(3) DEFAULT 2,
    estado_meta numeric(5,2)
)
WITH (oids = false);
--
-- Structure for table KPI_Nivel_Satisfaccion (OID = 19430) : 
--
CREATE TABLE "Datawarehouse"."KPI_Nivel_Satisfaccion" (
    "Programa" varchar(6) NOT NULL,
    "Nivel" varchar(7) NOT NULL,
    "Anho" varchar(7) NOT NULL,
    manual char(3) DEFAULT 1
)
WITH (oids = false);
--
-- Structure for table KPI_Relacion_Docentes (OID = 19434) : 
--
CREATE TABLE "Datawarehouse"."KPI_Relacion_Docentes" (
    anio char(5) NOT NULL,
    cant_docentes_tc integer,
    cant_docentes_hc integer,
    relacion_docentes numeric(5,2),
    "manual_Rela" char(3) DEFAULT 3
)
WITH (oids = false);
--
-- Structure for table acreditacion_alta_calidad (OID = 19438) : 
--
SET search_path = public, pg_catalog;
CREATE TABLE public.acreditacion_alta_calidad (
    resolucion varchar NOT NULL,
    programa varchar(6) NOT NULL,
    inicioacreditacion date NOT NULL,
    periodo integer DEFAULT 4 NOT NULL,
    activo boolean DEFAULT false NOT NULL,
    aviso varchar(2) DEFAULT 99 NOT NULL,
    gravedad integer DEFAULT 0 NOT NULL,
    mail boolean DEFAULT false NOT NULL,
    chkpm1 boolean DEFAULT false,
    mailpm1 boolean DEFAULT false,
    chkaev1 boolean DEFAULT false,
    mailaev1 boolean DEFAULT false,
    chkpm2 boolean DEFAULT false,
    mailpm2 boolean DEFAULT false,
    chkaev2 boolean DEFAULT false,
    mailaev2 boolean DEFAULT false,
    chkmen boolean DEFAULT false,
    mailmen boolean DEFAULT false
)
WITH (oids = false);
--
-- Structure for table estudiantes_departamento (OID = 19459) : 
--
CREATE TABLE public.estudiantes_departamento (
    cod_est_dep serial NOT NULL,
    departamento char(2),
    matriculados integer,
    anho char(4),
    periodo char(1)
)
WITH (oids = false);
--
-- Structure for table formacion (OID = 19464) : 
--
CREATE TABLE public.formacion (
    cod_formacion char(2) NOT NULL,
    nom_formacion varchar(12)
)
WITH (oids = false);
--
-- Structure for table formacion_departamento (OID = 19467) : 
--
CREATE TABLE public.formacion_departamento (
    cod_forma_dep serial NOT NULL,
    departamento char(2) NOT NULL,
    t_completo integer,
    t_ocasional integer,
    hora_catedra integer,
    anio varchar(5),
    periodo char(2),
    formacion char(2) NOT NULL
)
WITH (oids = false);
--
-- Structure for table manuales_indicadores (OID = 19472) : 
--
CREATE TABLE public.manuales_indicadores (
    codigo char(3) NOT NULL,
    proceso text,
    lider text,
    "objProceso" text,
    "nombreIndicador" text,
    "atriMedir" text,
    "objCalidad" text,
    "tipoIndicador" text,
    frecuencia text,
    "periodoCalculo" text,
    tendencia text,
    meta text,
    "objIndicador" text,
    rango text,
    formula text,
    "maneraGrafica" text,
    "puntoRegistro" text,
    resposable text,
    instructivo text,
    "sim_Rango_MA" char(2),
    "num_Rango_MA" numeric(4,2),
    "sim_Rango_A" char(2),
    "num_Rango_A" numeric(4,2),
    "sim_Rango_I" char(2),
    "num_Rango_I" numeric(4,2)
)
WITH (oids = false);
--
-- Structure for table programas (OID = 19478) : 
--
CREATE TABLE public.programas (
    snies varchar(6) NOT NULL,
    nivel char(1) DEFAULT 1 NOT NULL,
    codigo char(3),
    departamento varchar(2),
    nombre varchar(100) NOT NULL,
    abreviatura varchar(45),
    "fechaRegistro" char(4),
    estado boolean DEFAULT true NOT NULL
)
WITH (oids = false);
--
-- Structure for table users (OID = 19483) : 
--
CREATE TABLE public.users (
    codigo char(2) NOT NULL,
    "user" varchar(200) NOT NULL,
    pass varchar(200) NOT NULL,
    name varchar(60) NOT NULL,
    rol char(1) DEFAULT 0 NOT NULL,
    encriptado varchar(200),
    email varchar NOT NULL,
    alternative_email varchar
)
WITH (oids = false);
SET search_path = "Datawarehouse", pg_catalog;
COPY "KPI_Acreditacion" ("Anho", acreditados, programas, razon, "manual_Acredita") FROM stdin;
2013	8	59	14	4  
2015	13	59	22	4  
2010	6	45	13	4  
2011	8	51	16	4  
2012	9	56	16	4  
2014	7	59	12	4  
2016	16	59	27	4  
2017	19	63	30	4  
\.
COPY "KPI_Desercion_Cohorte" (programa, periodo, porcentaje, manual) FROM stdin;
786	2013-2	6.25	6  
3426	2006-2	31.37	6  
3426	2007-2	24.59	6  
4282	2010-2	6.67	6  
6564	2010-2	27.27	6  
105002	2000-2	35.29	6  
105002	2001-2	12.50	6  
105002	2002-2	17.78	6  
105002	2003-2	26.00	6  
105002	2004-2	14.29	6  
105002	2005-2	6.67	6  
105002	2006-2	19.15	6  
105002	2007-2	23.81	6  
788	2008-2	19.08	6  
788	2009-2	17.39	6  
788	2010-1	23.68	6  
788	2010-2	16.82	6  
788	2011-2	16.36	6  
788	2012-1	22.5	6  
788	2012-2	16.67	6  
788	2013-2	10.71	6  
788	2014-2	20	6  
788	2015-2	20.69	6  
19127	2008-2	15.69	6  
19127	2009-2	24	6  
19127	2010-2	14.04	6  
19127	2011-2	17.31	6  
19127	2012-2	14	6  
19127	2013-2	12.5	6  
19127	2014-2	4	6  
19127	2015-2	5.08	6  
4096	2008-2	14.89	6  
4096	2009-2	14.58	6  
4096	2010-2	10.81	6  
4096	2011-2	12.5	6  
4096	2012-2	9.52	6  
4096	2013-2	19.05	6  
4096	2014-2	18.37	6  
3426	2008-2	30.77	6  
3426	2009-2	31.71	6  
3426	2011-1	39.22	6  
3426	2012-1	47.92	6  
3426	2013-1	40.91	6  
3426	2014-1	31.91	6  
3426	2015-1	37.1	6  
90839	2008-1	13.64	6  
90839	2010-2	2.04	6  
90839	2011-2	16.28	6  
90839	2012-2	19.23	6  
90839	2013-2	20	6  
90839	2014-2	5.56	6  
90839	2015-2	22.58	6  
90860	2011-1	10.71	6  
90860	2012-1	15.38	6  
90860	2013-1	18.87	6  
90860	2014-1	7.41	6  
90860	2015-1	16.39	6  
786	2008-2	2	6  
786	2009-2	2.04	6  
786	2010-2	1.9	6  
786	2011-2	4.85	6  
786	2012-2	2.73	6  
786	2015-2	6.45	6  
786	1999-2	12.5	6  
103814	2008-2	18.52	6  
103814	2009-2	8.51	6  
103814	2010-2	12.73	6  
103814	2011-2	28.57	6  
103814	2012-2	11.76	6  
103814	2013-2	10.53	6  
103814	2014-2	7.69	6  
103814	2015-2	16.39	6  
4095	2008-2	16	6  
4095	2009-2	11.11	6  
4095	2010-2	13.16	6  
4095	2011-2	30.61	6  
4095	2012-2	15.91	6  
4095	2013-2	21.82	6  
4095	2015-2	15	6  
12696	2008-2	13.74	6  
12696	2009-2	19.01	6  
12696	2010-1	18.75	6  
12696	2011-1	16	6  
12696	2012-1	28.57	6  
12696	2013-1	31.11	6  
12696	2014-1	28.85	6  
12696	2015-1	26.23	6  
578	1998-2	40	6  
578	1999-2	40	6  
578	2000-2	28.26	6  
578	2008-2	38.64	6  
578	2009-2	64.58	6  
578	2010-2	33.33	6  
578	2011-2	63.83	6  
578	2012-2	24.44	6  
578	2013-2	47.17	6  
578	2014-2	42.59	6  
3318	2008-2	22.45	6  
3318	2011-1	22.92	6  
3318	2012-1	25	6  
3318	2013-1	26.92	6  
3318	2014-1	12.96	6  
3318	2015-1	14.29	6  
101578	2012-1	20	6  
101578	2014-1	17.31	6  
101578	2015-1	12.07	6  
4282	2008-1	22.92	6  
4282	2009-1	19.51	6  
4282	2009-2	12.5	6  
4282	2011-1	22.45	6  
4282	2012-1	35.42	6  
4282	2013-1	35.85	6  
4282	2014-1	18.52	6  
4282	2015-1	14.29	6  
101576	2008-2	24.44	6  
101576	2009-2	17.5	6  
101576	2010-2	27.27	6  
101576	2012-1	30.23	6  
101576	2014-1	26.09	6  
101576	2015-1	34.21	6  
6564	2008-1	27.03	6  
6564	2008-2	31.43	6  
6564	2009-1	30.23	6  
6564	2009-2	21.74	6  
6564	2010-1	21.43	6  
6564	2011-1	22	6  
6564	2012-1	23.91	6  
6564	2013-1	22.92	6  
6564	2014-1	23.21	6  
6564	2015-1	26.98	6  
790	2008-2	26	6  
790	2009-2	10.64	6  
790	2010-1	50	6  
790	2010-2	20	6  
790	2011-2	16.36	6  
790	2012-2	8.7	6  
790	2013-2	11.54	6  
790	2014-2	20	6  
790	2015-2	14.29	6  
91280	2011-2	19.23	6  
91280	2012-2	20	6  
91280	2013-2	17.86	6  
91280	2014-2	15.09	6  
91280	2015-2	19.3	6  
789	2008-2	23.71	6  
789	2009-2	25.58	6  
789	2010-1	13.64	6  
789	2011-1	16.67	6  
789	2012-1	14	6  
789	2013-1	12.77	6  
789	2014-1	17.31	6  
789	2015-1	13.82	6  
101580	2009-2	32.56	6  
101580	2012-1	21.43	6  
101580	2014-1	25	6  
101580	2015-1	14.29	6  
101579	2012-1	23.81	6  
101579	2014-1	19.61	6  
101579	2015-1	22.86	6  
3474	2008-2	25	6  
3474	2009-2	37.33	6  
3474	2010-1	38.1	6  
3474	2011-1	9.43	6  
3474	2012-1	32.73	6  
3474	2013-1	12.5	6  
3474	2014-1	25.53	6  
3474	2015-1	24.19	6  
11632	2001-2	17.02	6  
11632	2002-2	14.58	6  
11632	2008-2	26.53	6  
11632	2009-2	26.97	6  
11632	2010-1	50.7	6  
11632	2011-1	6.52	6  
11632	2012-1	26	6  
11632	2013-1	17.39	6  
11632	2014-1	24.07	6  
11632	2015-1	35.59	6  
6566	2008-2	36.73	6  
6566	2009-2	36.59	6  
6566	2010-2	32.73	6  
6566	2011-2	28	6  
6566	2012-2	27.08	6  
6566	2013-2	23.08	6  
6566	2014-2	18.18	6  
6566	2015-2	42.37	6  
16840	2008-2	17.65	6  
16840	2009-2	23.08	6  
16840	2011-1	25	6  
16840	2012-1	28.26	6  
16840	2013-1	37.5	6  
16840	2014-1	34.21	6  
16840	2015-1	19.3	6  
16839	2008-1	23.81	6  
16839	2009-1	23.91	6  
16839	2009-2	31.71	6  
16839	2011-1	12	6  
16839	2012-1	23.68	6  
16839	2013-1	17.02	6  
16839	2014-1	17.31	6  
16839	2015-1	14.52	6  
101558	2012-1	16.28	6  
101558	2015-2	10.42	6  
105002	2008-2	25	6  
105002	2009-2	15	6  
105002	2011-1	22.22	6  
105002	2012-1	32.61	6  
105002	2013-1	14.29	6  
105002	2014-1	22.64	6  
105002	2015-1	16.13	6  
16843	2000-2	9.09	6  
16843	2001-2	6.98	6  
16843	2002-2	17.39	6  
16843	2008-2	13.33	6  
16843	2009-2	19.15	6  
16843	2010-2	10	6  
16843	2011-2	4	6  
16843	2012-2	40.82	6  
16843	2013-2	7.84	6  
16843	2014-2	12.5	6  
16843	2015-2	13.79	6  
2715	2008-2	17.78	6  
2715	2009-2	31.11	6  
2715	2010-2	10	6  
2715	2011-2	28	6  
2715	2012-2	30	6  
2715	2013-2	15.09	6  
2715	2014-2	13.46	6  
2715	2015-2	20.34	6  
2972	2008-2	27.91	6  
2972	2009-2	17.02	6  
2972	2010-2	17.65	6  
2972	2011-2	16	6  
2972	2012-2	16.07	6  
2972	2013-2	18	6  
2972	2014-2	18.75	6  
2972	2015-2	22.41	6  
16842	2008-2	28.57	6  
16842	2009-2	18.37	6  
16842	2011-1	11.54	6  
16842	2012-1	24	6  
16842	2013-1	21.15	6  
16842	2014-1	16.67	6  
16842	2015-1	22.03	6  
16841	2008-2	18.6	6  
16841	2009-2	17.78	6  
16841	2010-2	5.88	6  
16841	2011-2	13.73	6  
16841	2012-2	17.39	6  
16841	2013-2	7.27	6  
16841	2014-2	9.8	6  
16841	2015-2	11.48	6  
101305	2015-1	6.45	6  
783	2008-2	34.78	6  
783	2009-2	48.84	6  
783	2011-1	38.46	6  
783	2012-1	29.55	6  
783	2013-1	59.57	6  
783	2014-1	32.69	6  
783	2015-1	45.9	6  
779	2008-2	10.2	6  
779	2009-2	21.43	6  
779	2010-2	7.55	6  
779	2011-2	16.33	6  
779	2012-2	6.25	6  
779	2013-2	14.04	6  
779	2014-2	11.11	6  
779	2015-2	2.17	6  
20824	2008-2	16.39	6  
20824	2009-2	18	6  
20824	2010-2	11.54	6  
20824	2011-2	6.9	6  
20824	2012-2	17.24	6  
20824	2013-2	7.55	6  
20824	2014-2	6.45	6  
20824	2015-2	7.94	6  
2887	2008-1	29.55	6  
2887	2009-1	16	6  
2887	2009-2	10	6  
2887	2011-1	25.93	6  
2887	2012-1	20.41	6  
2887	2013-1	18.37	6  
2887	2014-1	20.83	6  
2887	2015-1	21.31	6  
91489	2012-1	18.52	6  
91489	2013-1	27.45	6  
91489	2014-1	17.39	6  
91489	2015-1	25.81	6  
3928	2008-2	14.81	6  
3928	2009-2	16.67	6  
3928	2011-1	14.81	6  
3928	2012-1	21.43	6  
3928	2013-1	3.64	6  
3928	2014-1	9.62	6  
3928	2015-1	6.56	6  
4492	2008-2	29.79	6  
4492	2009-2	37.14	6  
4492	2011-1	48	6  
4492	2012-1	37.25	6  
4492	2013-1	30.95	6  
4492	2014-1	39.22	6  
4492	2015-1	39.34	6  
3319	2008-2	24.44	6  
3319	2009-2	23.26	6  
3319	2010-2	8.33	6  
3319	2011-2	38.78	6  
3319	2012-2	25.49	6  
3319	2013-2	9.26	6  
3319	2014-2	9.8	6  
3189	2008-2	19.15	6  
3189	2009-2	22.22	6  
3189	2010-2	19.57	6  
3189	2011-2	38.78	6  
3189	2012-2	44.9	6  
3189	2013-2	41.18	6  
8405	2008-2	34.09	6  
8405	2009-2	20.69	6  
8405	2011-1	25	6  
8405	2012-1	13.04	6  
8405	2013-1	15.38	6  
8405	2014-1	14.89	6  
8405	2015-1	9.84	6  
777	1998-2	19.44	6  
777	2008-2	10.87	6  
777	2009-2	17.14	6  
777	2011-1	14.81	6  
777	2012-1	29.17	6  
777	2013-1	34.04	6  
777	2014-1	17.31	6  
777	2015-1	45	6  
1206	2010-1	28.21	6  
1206	2010-2	14.32	6  
1206	2011-1	21.06	6  
1206	2011-2	20.78	6  
1206	2012-1	25.47	6  
1206	2012-2	18.41	6  
1206	2013-1	24.07	6  
1206	2013-2	14.72	6  
1206	2014-1	21.39	6  
1206	2014-2	12.28	6  
1206	2015-1	22.16	6  
1206	2015-2	15.27	6  
\.
COPY "KPI_Desercion_Periodo" (programa, periodo, no_graduados, desertores, desercion, retencion, manual) FROM stdin;
16839	2008-1	166	28	16.18	83.82	7  
16839	2008-2	140	10	6.99	93.01	7  
16839	2009-1	162	24	14.46	85.54	7  
16839	2009-2	182	8	5.71	94.29	7  
105002	2000-1	67	3	10.71	89.29	7  
105002	2000-2	116	7	9.46	90.54	7  
105002	2001-1	96	2	2.99	97.01	7  
105002	2001-2	140	19	16.38	83.62	7  
105002	2002-1	130	5	5.21	94.79	7  
105002	2002-2	172	6	4.29	95.71	7  
105002	2003-1	159	5	3.85	96.15	7  
105002	2003-2	182	10	5.81	94.19	7  
105002	2004-1	125	27	16.98	83.02	7  
105002	2004-2	171	46	25.27	74.73	7  
105002	2005-1	146	5	4.00	96.00	7  
105002	2005-2	178	10	5.85	94.15	7  
105002	2006-1	153	5	3.42	96.58	7  
105002	2006-2	190	8	4.49	95.51	7  
105002	2007-1	159	8	5.23	94.77	7  
105002	2007-2	168	14	7.37	92.63	7  
105002	2008-1	157	18	11.32	88.68	7  
105002	2008-2	183	14	8.33	91.67	7  
105002	2009-1	151	7	4.46	95.54	7  
105002	2009-2	164	14	7.65	92.35	7  
788	2010-1	598	25	5.42	94.58	7  
788	2010-2	627	38	6.93	93.07	7  
788	2011-1	507	65	10.87	89.13	7  
788	2011-2	517	27	4.31	95.69	7  
788	2012-1	510	17	3.35	96.65	7  
788	2012-2	499	26	5.03	94.97	7  
788	2013-1	437	28	5.49	94.51	7  
788	2013-2	449	30	6.01	93.99	7  
788	2014-1	321	15	3.43	96.57	7  
788	2014-2	314	17	3.79	96.21	7  
788	2015-1	283	4	1.25	98.75	7  
788	2015-2	337	20	6.37	93.63	7  
788	2016-1	0	12	4.24	95.76	7  
788	2016-2	0	41	12.17	87.83	7  
19127	2008-1	179	7	5.30	94.70	7  
19127	2008-2	232	23	11.06	88.94	7  
19127	2009-1	197	6	3.35	96.65	7  
19127	2009-2	234	19	8.19	91.81	7  
19127	2010-1	208	8	4.06	95.94	7  
19127	2010-2	263	22	9.40	90.60	7  
19127	2011-1	236	13	6.25	93.75	7  
19127	2011-2	271	14	5.32	94.68	7  
19127	2012-1	249	3	1.27	98.73	7  
19127	2012-2	283	13	4.80	95.20	7  
19127	2013-1	266	5	2.01	97.99	7  
19127	2013-2	260	13	4.59	95.41	7  
19127	2014-1	257	9	3.38	96.62	7  
19127	2014-2	280	15	5.77	94.23	7  
19127	2015-1	263	9	3.50	96.50	7  
19127	2015-2	310	13	4.64	95.36	7  
19127	2016-1	0	7	2.66	97.34	7  
19127	2016-2	0	13	4.19	95.81	7  
4096	2010-1	156	11	7.10	92.90	7  
4096	2010-2	180	14	7.87	92.13	7  
4096	2011-1	161	16	10.26	89.74	7  
4096	2011-2	186	6	3.33	96.67	7  
4096	2012-1	175	7	4.35	95.65	7  
4096	2012-2	217	11	5.91	94.09	7  
4096	2013-1	188	5	2.86	97.14	7  
4096	2013-2	215	20	9.22	90.78	7  
4096	2014-1	195	7	3.72	96.28	7  
4096	2014-2	210	16	7.44	92.56	7  
4096	2015-1	184	5	2.56	97.44	7  
4096	2015-2	164	19	9.05	90.95	7  
4096	2016-1	0	15	8.15	91.85	7  
4096	2016-2	0	16	9.76	90.24	7  
3426	2006-1	127	10	9.43	90.57	7  
3426	2006-2	148	22	13.92	86.08	7  
3426	2007-1	115	18	14.17	85.83	7  
3426	2007-2	158	22	14.86	85.14	7  
3426	2008-1	139	9	7.83	92.17	7  
3426	2008-2	144	22	13.92	86.08	7  
3426	2009-1	118	24	17.27	82.73	7  
3426	2009-2	144	23	15.97	84.03	7  
3426	2010-1	118	11	9.32	90.68	7  
3426	2010-2	86	20	13.89	86.11	7  
3426	2011-1	123	27	22.88	77.12	7  
3426	2011-2	98	2	2.33	97.67	7  
3426	2012-1	128	22	17.89	82.11	7  
3426	2012-2	93	16	16.33	83.67	7  
3426	2013-1	117	28	21.88	78.12	7  
3426	2013-2	86	7	7.53	92.47	7  
3426	2014-1	117	24	20.51	79.49	7  
3426	2014-2	103	10	11.63	88.37	7  
3426	2015-1	144	21	17.95	82.05	7  
3426	2015-2	114	11	10.68	89.32	7  
3426	2016-1	0	31	21.53	78.47	7  
3426	2016-2	0	11	9.65	90.35	7  
90839	2010-1	324	15	3.42	96.58	7  
90839	2010-2	327	21	5.61	94.39	7  
90839	2011-1	266	27	8.33	91.67	7  
90839	2011-2	274	11	3.36	96.64	7  
90839	2012-1	311	5	1.88	98.12	7  
90839	2012-2	331	19	6.93	93.07	7  
90839	2013-1	268	6	1.93	98.07	7  
90839	2013-2	285	22	6.65	93.35	7  
90839	2014-1	243	12	4.48	95.52	7  
90839	2014-2	267	24	8.42	91.58	7  
90839	2015-1	242	6	2.47	97.53	7  
90839	2015-2	297	13	4.87	95.13	7  
90839	2016-1	0	16	6.61	93.39	7  
90839	2016-2	0	39	13.13	86.87	7  
90860	2011-1	56	0	0.00	0.00	7  
90860	2011-2	48	0	0.00	0.00	7  
90860	2012-1	98	6	10.71	89.29	7  
90860	2012-2	89	1	2.08	97.92	7  
90860	2013-1	142	8	8.16	91.84	7  
90860	2013-2	128	1	1.12	98.88	7  
90860	2014-1	178	13	9.15	90.85	7  
90860	2014-2	175	5	3.91	96.09	7  
90860	2015-1	231	5	2.81	97.19	7  
90860	2015-2	214	2	1.14	98.86	7  
90860	2016-1	0	13	5.63	94.37	7  
90860	2016-2	0	7	3.27	96.73	7  
786	2008-1	392	20	4.69	95.31	7  
786	2008-2	437	3	0.69	99.31	7  
786	2009-1	395	10	2.55	97.45	7  
786	2009-2	448	5	1.14	98.86	7  
786	2010-1	413	9	2.28	97.72	7  
786	2010-2	519	5	1.12	98.88	7  
786	2011-1	474	13	3.15	96.85	7  
786	2011-2	519	2	0.39	99.61	7  
786	2012-1	412	16	3.38	96.62	7  
786	2012-2	576	6	1.16	98.84	7  
786	2013-1	33	13	3.16	96.84	7  
786	2013-2	584	23	3.99	96.01	7  
786	2014-1	556	0	0.00	0.00	7  
786	2014-2	605	1	0.17	99.83	7  
786	2015-1	578	27	4.86	95.14	7  
786	2015-2	665	2	0.33	99.67	7  
786	2016-1	0	23	3.98	96.02	7  
786	2016-2	0	29	4.36	95.64	7  
4095	2008-1	173	19	11.66	88.34	7  
4095	2008-2	201	18	9.47	90.53	7  
4095	2009-1	164	6	3.47	96.53	7  
4095	2009-2	202	17	8.46	91.54	7  
4095	2010-1	174	3	1.83	98.17	7  
4095	2010-2	203	15	7.43	92.57	7  
4095	2011-1	185	14	8.05	91.95	7  
4095	2011-2	212	10	4.93	95.07	7  
4095	2012-1	197	4	2.16	97.84	7  
4095	2012-2	230	20	9.43	90.57	7  
4095	2013-1	173	4	2.03	97.97	7  
4095	2013-2	219	16	6.96	93.04	7  
4095	2014-1	190	6	3.47	96.53	7  
4095	2014-2	207	21	9.59	90.41	7  
4095	2015-1	186	9	4.74	95.26	7  
4095	2015-2	217	11	5.31	94.69	7  
4095	2016-1	0	10	5.38	94.62	7  
4095	2016-2	0	19	8.76	91.24	7  
103814	2008-1	195	15	7.69	92.31	7  
103814	2008-2	234	16	7.08	92.92	7  
103814	2009-1	191	22	11.28	88.72	7  
103814	2009-2	214	21	8.97	91.03	7  
103814	2010-1	192	34	17.80	82.20	7  
103814	2010-2	55	28	13.08	86.92	7  
103814	2011-1	70	132	68.75	31.25	7  
103814	2011-2	113	7	12.73	87.27	7  
103814	2012-1	62	8	11.43	88.57	7  
103814	2012-2	104	24	21.24	78.76	7  
103814	2013-1	84	13	20.97	79.03	7  
103814	2013-2	136	19	18.27	81.73	7  
103814	2014-1	126	4	4.76	95.24	7  
103814	2014-2	188	8	5.88	94.12	7  
103814	2015-1	114	5	3.97	96.03	7  
103814	2015-2	171	17	9.04	90.96	7  
103814	2016-1	0	5	4.39	95.61	7  
103814	2016-2	0	15	8.77	91.23	7  
12696	2008-1	310	17	5.09	94.91	7  
12696	2008-2	411	27	7.36	92.64	7  
12696	2009-1	368	10	3.23	96.77	7  
12696	2009-2	452	27	6.57	93.43	7  
12696	2010-1	462	13	3.53	96.47	7  
12696	2010-2	435	39	8.63	91.37	7  
12696	2011-1	428	38	8.23	91.77	7  
12696	2011-2	389	25	5.75	94.25	7  
12696	2012-1	407	15	3.50	96.50	7  
12696	2012-2	361	15	3.86	96.14	7  
12696	2013-1	328	23	5.65	94.35	7  
12696	2013-2	284	18	4.99	95.01	7  
12696	2014-1	311	28	8.54	91.46	7  
12696	2014-2	270	8	2.82	97.18	7  
12696	2015-1	288	23	7.40	92.60	7  
12696	2015-2	242	14	5.19	94.81	7  
12696	2016-1	0	30	10.42	89.58	7  
12696	2016-2	0	24	9.92	90.08	7  
578	2009-1	107	16	13.33	86.67	7  
578	2009-2	151	29	20.28	79.72	7  
578	2010-1	113	10	9.35	90.65	7  
578	2010-2	120	40	26.49	73.51	7  
578	2011-1	75	46	40.71	59.29	7  
578	2011-2	127	25	20.83	79.17	7  
578	2012-1	79	3	4.00	96.00	7  
578	2012-2	126	37	29.13	70.87	7  
578	2013-1	86	4	5.06	94.94	7  
578	2013-2	133	23	18.25	81.75	7  
578	2014-1	92	8	9.30	90.70	7  
578	2014-2	152	31	23.31	76.69	7  
578	2015-1	101	6	6.52	93.48	7  
578	2015-2	100	44	28.95	71.05	7  
578	2016-1	0	11	10.89	89.11	7  
578	2016-2	0	16	16.00	84.00	7  
3318	2008-1	173	6	3.35	96.65	7  
3318	2008-2	194	9	4.59	95.41	7  
3318	2009-1	176	5	2.89	97.11	7  
3318	2009-2	150	13	6.70	93.30	7  
3318	2010-1	144	11	6.25	93.75	7  
3318	2010-2	109	6	4.00	96.00	7  
3318	2011-1	150	18	12.50	87.50	7  
3318	2011-2	117	3	2.75	97.25	7  
3318	2012-1	177	16	10.67	89.33	7  
3318	2012-2	130	5	4.27	95.73	7  
3318	2013-1	173	14	7.91	92.09	7  
3318	2013-2	139	1	0.77	99.23	7  
3318	2014-1	124	20	11.56	88.44	7  
3318	2014-2	123	58	41.73	58.27	7  
3318	2015-1	162	10	8.06	91.94	7  
3318	2015-2	151	17	13.82	86.18	7  
3318	2016-1	0	18	11.11	88.89	7  
3318	2016-2	0	13	8.61	91.39	7  
4282	2008-1	202	20	8.26	91.74	7  
4282	2008-2	169	9	4.43	95.57	7  
4282	2009-1	176	14	6.93	93.07	7  
4282	2009-2	196	8	4.73	95.27	7  
4282	2010-1	170	11	6.25	93.75	7  
4282	2010-2	121	6	3.06	96.94	7  
4282	2011-1	162	39	22.94	77.06	7  
4282	2011-2	129	3	2.48	97.52	7  
4282	2012-1	169	18	11.11	88.89	7  
4282	2012-2	133	1	0.78	99.22	7  
4282	2013-1	168	19	11.24	88.76	7  
4282	2013-2	133	8	6.02	93.98	7  
4282	2014-1	175	25	14.88	85.12	7  
4282	2014-2	156	2	1.50	98.50	7  
4282	2015-1	201	11	6.29	93.71	7  
4282	2015-2	176	5	3.21	96.79	7  
4282	2016-1	0	13	6.47	93.53	7  
4282	2016-2	0	6	3.41	96.59	7  
101578	2010-1	38	0	0.00	0.00	7  
101578	2010-2	50	0	0.00	0.00	7  
101578	2011-1	36	4	10.53	89.47	7  
101578	2011-2	37	2	4.00	96.00	7  
101578	2012-1	79	1	2.78	97.22	7  
101578	2012-2	71	1	2.70	97.30	7  
101578	2013-1	60	10	12.66	87.34	7  
101578	2013-2	58	5	7.04	92.96	7  
101578	2014-1	106	4	6.67	93.33	7  
101578	2014-2	97	3	5.17	94.83	7  
101578	2015-1	148	9	8.49	91.51	7  
101578	2015-2	140	2	2.06	97.94	7  
101578	2016-1	0	8	5.41	94.59	7  
101578	2016-2	0	9	6.43	93.57	7  
101576	2010-1	124	10	9.35	90.65	7  
101576	2010-2	150	12	8.63	91.37	7  
101576	2011-1	120	15	12.10	87.90	7  
101576	2011-2	106	13	8.67	91.33	7  
101576	2012-1	153	4	3.33	96.67	7  
101576	2012-2	140	0	0.00	0.00	7  
101576	2013-1	109	16	10.46	89.54	7  
101576	2013-2	88	21	15.00	85.00	7  
101576	2014-1	130	3	2.75	97.25	7  
101576	2014-2	107	2	2.27	97.73	7  
101576	2015-1	139	14	10.77	89.23	7  
101576	2015-2	117	4	3.74	96.26	7  
101576	2016-1	0	15	10.79	89.21	7  
101576	2016-2	0	10	8.55	91.45	7  
6564	2008-1	316	31	10.30	89.70	7  
6564	2008-2	318	18	6.04	93.96	7  
6564	2009-1	314	31	9.81	90.19	7  
6564	2009-2	320	31	8.49	91.51	7  
6564	2010-1	291	22	7.01	92.99	7  
6564	2010-2	254	22	6.88	93.12	7  
6564	2011-1	286	41	14.09	85.91	7  
6564	2011-2	226	5	1.97	98.03	7  
6564	2012-1	278	17	5.94	94.06	7  
6564	2012-2	236	15	6.64	93.36	7  
6564	2013-1	268	18	6.47	93.53	7  
6564	2013-2	207	9	3.81	96.19	7  
6564	2014-1	236	15	5.60	94.40	7  
6564	2014-2	199	10	4.83	95.17	7  
6564	2015-1	244	18	7.63	92.37	7  
6564	2015-2	210	17	8.54	91.46	7  
6564	2016-1	0	25	10.25	89.75	7  
6564	2016-2	0	6	2.86	97.14	7  
790	2008-1	256	11	4.10	95.90	7  
790	2008-2	267	11	3.67	96.33	7  
790	2009-1	218	11	4.30	95.70	7  
790	2009-2	226	19	7.12	92.88	7  
790	2010-1	208	8	3.67	96.33	7  
790	2010-2	234	12	5.31	94.69	7  
790	2011-1	183	14	6.73	93.27	7  
790	2011-2	203	13	5.56	94.44	7  
790	2012-1	174	3	1.64	98.36	7  
790	2012-2	218	15	7.39	92.61	7  
790	2013-1	178	2	1.15	98.85	7  
790	2013-2	192	21	9.63	90.37	7  
790	2014-1	164	6	3.37	96.63	7  
790	2014-2	207	10	5.21	94.79	7  
790	2015-1	170	7	4.27	95.73	7  
790	2015-2	236	21	10.14	89.86	7  
790	2016-1	0	2	1.18	98.82	7  
790	2016-2	0	30	12.71	87.29	7  
91280	2011-2	52	0	0.00	0.00	7  
91280	2012-1	39	0	0.00	0.00	7  
91280	2012-2	80	10	19.23	80.77	7  
91280	2013-1	73	0	0.00	0.00	7  
91280	2013-2	127	9	11.25	88.75	7  
91280	2014-1	114	2	2.74	97.26	7  
91280	2014-2	168	10	7.87	92.13	7  
91280	2015-1	154	2	1.75	98.25	7  
91280	2015-2	202	8	4.76	95.24	7  
91280	2016-1	0	4	2.60	97.40	7  
91280	2016-2	0	15	7.43	92.57	7  
789	2009-1	370	23	5.67	94.33	7  
789	2009-2	431	42	9.01	90.99	7  
789	2010-1	406	8	2.16	97.84	7  
789	2010-2	378	39	9.05	90.95	7  
789	2011-1	397	42	10.34	89.66	7  
789	2011-2	358	9	2.38	97.62	7  
789	2012-1	422	18	4.53	95.47	7  
789	2012-2	390	9	2.51	97.49	7  
789	2013-1	448	13	3.08	96.92	7  
789	2013-2	458	11	2.82	97.18	7  
789	2014-1	469	17	3.79	96.21	7  
789	2014-2	434	9	1.97	98.03	7  
789	2015-1	521	21	4.48	95.52	7  
789	2015-2	480	15	3.46	96.54	7  
789	2016-1	0	28	5.37	94.63	7  
789	2016-2	0	28	5.83	94.17	7  
3474	2008-1	199	4	2.05	97.95	7  
3474	2008-2	250	24	10.67	89.33	7  
3474	2009-1	219	14	7.04	92.96	7  
3474	2009-2	264	28	11.20	88.80	7  
3474	2010-1	238	11	5.02	94.98	7  
3474	2010-2	207	38	14.39	85.61	7  
3474	2011-1	231	36	15.13	84.87	7  
3474	2011-2	211	15	7.25	92.75	7  
3474	2012-1	260	12	5.19	94.81	7  
3474	2012-2	210	13	6.16	93.84	7  
3474	2013-1	245	26	10.00	90.00	7  
3474	2013-2	206	10	4.76	95.24	7  
3474	2014-1	238	15	6.12	93.88	7  
3474	2014-2	212	3	1.46	98.54	7  
3474	2015-1	242	19	7.98	92.02	7  
3474	2015-2	212	15	7.08	92.92	7  
3474	2016-1	0	24	9.92	90.08	7  
3474	2016-2	0	16	7.55	92.45	7  
101580	2010-1	73	4	5.97	94.03	7  
101580	2010-2	61	16	17.20	82.80	7  
101580	2011-1	56	13	17.81	82.19	7  
101580	2011-2	45	3	4.92	95.08	7  
101580	2012-1	89	2	3.57	96.43	7  
101580	2012-2	85	1	2.22	97.78	7  
101580	2013-1	74	10	11.24	88.76	7  
101580	2013-2	68	9	10.59	89.41	7  
101580	2014-1	88	3	4.05	95.95	7  
101580	2014-2	75	2	2.94	97.06	7  
101580	2015-1	104	8	9.09	90.91	7  
101580	2015-2	96	8	10.67	89.33	7  
101580	2016-1	0	8	7.69	92.31	7  
101580	2016-2	0	11	11.46	88.54	7  
101579	2010-1	64	1	2.86	97.14	7  
101579	2010-2	49	3	8.57	91.43	7  
101579	2011-1	37	21	32.81	67.19	7  
101579	2011-2	33	6	12.24	87.76	7  
101579	2012-1	73	0	0.00	0.00	7  
101579	2012-2	55	2	6.06	93.94	7  
101579	2013-1	56	11	15.07	84.93	7  
101579	2013-2	55	1	1.82	98.18	7  
101579	2014-1	100	3	5.36	94.64	7  
101579	2014-2	89	4	7.27	92.73	7  
101579	2015-1	116	10	10.00	90.00	7  
101579	2015-2	91	11	12.36	87.64	7  
101579	2016-1	0	16	13.79	86.21	7  
101579	2016-2	0	8	8.79	91.21	7  
11632	2008-1	298	10	4.24	95.76	7  
11632	2008-2	316	29	8.61	91.39	7  
11632	2009-1	279	19	6.38	93.62	7  
11632	2009-2	360	27	8.54	91.46	7  
11632	2010-1	369	11	3.94	96.06	7  
11632	2010-2	273	42	11.67	88.33	7  
11632	2011-1	296	89	24.12	75.88	7  
11632	2011-2	247	6	2.20	97.80	7  
11632	2012-1	319	14	4.73	95.27	7  
11632	2012-2	274	7	2.83	97.17	7  
11632	2013-1	294	20	6.27	93.73	7  
11632	2013-2	257	8	2.92	97.08	7  
11632	2014-1	291	23	7.82	92.18	7  
11632	2014-2	249	6	2.33	97.67	7  
11632	2015-1	282	19	6.53	93.47	7  
11632	2015-2	238	19	7.63	92.37	7  
11632	2016-1	0	40	14.18	85.82	7  
11632	2016-2	0	11	4.62	95.38	7  
6566	2008-1	158	11	6.96	93.04	7  
6566	2008-2	196	14	7.45	92.55	7  
6566	2009-1	155	9	5.70	94.30	7  
6566	2009-2	191	28	14.29	85.71	7  
6566	2010-1	164	12	7.74	92.26	7  
6566	2010-2	169	23	12.04	87.96	7  
6566	2011-1	140	34	20.73	79.27	7  
6566	2011-2	171	26	15.38	84.62	7  
6566	2012-1	161	6	4.29	95.71	7  
6566	2012-2	193	19	11.11	88.89	7  
6566	2013-1	143	9	5.59	94.41	7  
6566	2013-2	173	30	15.54	84.46	7  
6566	2014-1	146	19	13.29	86.71	7  
6566	2014-2	192	18	10.40	89.60	7  
6566	2015-1	164	7	4.79	95.21	7  
6566	2015-2	218	21	10.94	89.06	7  
6566	2016-1	0	13	7.93	92.07	7  
6566	2016-2	0	49	22.48	77.52	7  
16840	2010-1	108	3	3.16	96.84	7  
16840	2010-2	70	10	8.55	91.45	7  
16840	2011-1	100	14	12.96	87.04	7  
16840	2011-2	95	1	1.43	98.57	7  
16840	2012-1	142	10	10.00	90.00	7  
16840	2012-2	121	5	5.26	94.74	7  
16840	2013-1	151	14	9.86	90.14	7  
16840	2013-2	126	5	4.13	95.87	7  
16840	2014-1	159	23	15.23	84.77	7  
16840	2014-2	112	7	5.56	94.44	7  
16840	2015-1	170	27	16.98	83.02	7  
16840	2015-2	144	3	2.68	97.32	7  
16840	2016-1	0	19	11.18	88.82	7  
16840	2016-2	0	13	9.03	90.97	7  
105002	2010-1	142	5	3.31	96.69	7  
105002	2010-2	114	8	4.88	95.12	7  
105002	2011-1	162	19	13.38	86.62	7  
105002	2011-2	119	1	0.88	99.12	7  
105002	2012-1	168	16	9.88	90.12	7  
105002	2012-2	130	5	4.20	95.80	7  
105002	2013-1	164	18	10.71	89.29	7  
105002	2013-2	125	7	5.38	94.62	7  
105002	2014-1	175	11	6.71	93.29	7  
105002	2014-2	163	4	3.20	96.80	7  
105002	2015-1	185	17	9.71	90.29	7  
105002	2015-2	174	11	6.75	93.25	7  
105002	2016-1	0	16	8.65	91.35	7  
105002	2016-2	0	15	8.62	91.38	7  
16839	2010-1	153	15	9.26	90.74	7  
16839	2010-2	102	18	9.89	90.11	7  
16839	2011-1	141	43	28.10	71.90	7  
16839	2011-2	127	4	3.92	96.08	7  
16839	2012-1	144	8	5.67	94.33	7  
16839	2012-2	124	11	8.66	91.34	7  
16839	2013-1	158	11	7.64	92.36	7  
16839	2013-2	128	4	3.23	96.77	7  
16839	2014-1	176	11	6.96	93.04	7  
16839	2014-2	159	2	1.56	98.44	7  
16839	2015-1	190	14	7.95	92.05	7  
16839	2015-2	170	14	8.81	91.19	7  
16839	2016-1	0	16	8.42	91.58	7  
16839	2016-2	0	8	4.71	95.29	7  
101558	2012-1	43	0	0.00	0.00	7  
101558	2012-2	36	0	0.00	0.00	7  
101558	2013-1	33	7	16.28	83.72	7  
101558	2013-2	32	3	8.33	91.67	7  
101558	2014-1	31	1	3.03	96.97	7  
101558	2014-2	30	1	3.12	96.88	7  
101558	2015-1	29	1	3.23	96.77	7  
101558	2015-2	77	1	3.33	96.67	7  
101558	2016-1	0	0	0.00	0.00	7  
101558	2016-2	0	5	6.49	93.51	7  
16843	2008-1	137	13	9.35	90.65	7  
16843	2008-2	165	22	12.79	87.21	7  
16843	2009-1	150	7	5.11	94.89	7  
16843	2009-2	180	9	5.45	94.55	7  
16843	2010-1	154	10	6.67	93.33	7  
16843	2010-2	169	13	7.22	92.78	7  
16843	2011-1	161	11	7.14	92.86	7  
16843	2011-2	186	6	3.55	96.45	7  
16843	2012-1	171	8	4.97	95.03	7  
16843	2012-2	200	9	4.84	95.16	7  
16843	2013-1	173	6	3.51	96.49	7  
16843	2013-2	190	27	13.50	86.50	7  
16843	2014-1	182	8	4.62	95.38	7  
16843	2014-2	208	6	3.16	96.84	7  
16843	2015-1	187	5	2.75	97.25	7  
16843	2015-2	235	12	5.77	94.23	7  
16843	2016-1	0	9	4.81	95.19	7  
16843	2016-2	0	30	12.77	87.23	7  
2715	2008-1	185	10	5.26	94.74	7  
2715	2008-2	161	22	10.14	89.86	7  
2715	2009-1	140	11	5.95	94.05	7  
2715	2009-2	173	12	7.45	92.55	7  
2715	2010-1	150	6	4.29	95.71	7  
2715	2010-2	167	20	11.56	88.44	7  
2715	2011-1	131	22	14.67	85.33	7  
2715	2011-2	167	11	6.59	93.41	7  
2715	2012-1	157	5	3.82	96.18	7  
2715	2012-2	190	16	9.58	90.42	7  
2715	2013-1	159	7	4.46	95.54	7  
2715	2013-2	195	24	12.63	87.37	7  
2715	2014-1	173	11	6.92	93.08	7  
2715	2014-2	209	13	6.67	93.33	7  
2715	2015-1	178	3	1.73	98.27	7  
2715	2015-2	232	15	7.18	92.82	7  
2715	2016-1	0	11	6.18	93.82	7  
2715	2016-2	0	19	8.19	91.81	7  
2972	2008-1	172	13	7.47	92.53	7  
2972	2008-2	171	24	12.57	87.43	7  
2972	2009-1	143	14	8.14	91.86	7  
2972	2009-2	169	23	13.45	86.55	7  
2972	2010-1	153	14	9.79	90.21	7  
2972	2010-2	194	12	7.10	92.90	7  
2972	2011-1	165	13	8.50	91.50	7  
2972	2011-2	208	14	7.22	92.78	7  
2972	2012-1	191	3	1.82	98.18	7  
2972	2012-2	249	14	6.73	93.27	7  
2972	2013-1	227	3	1.57	98.43	7  
2972	2013-2	254	16	6.43	93.57	7  
2972	2014-1	220	13	5.73	94.27	7  
2972	2014-2	258	15	5.91	94.09	7  
2972	2015-1	219	5	2.27	97.73	7  
2972	2015-2	277	24	9.30	90.70	7  
2972	2016-1	0	11	5.02	94.98	7  
2972	2016-2	0	36	13.00	87.00	7  
16842	2008-1	128	11	8.40	91.60	7  
16842	2008-2	153	14	8.86	91.14	7  
16842	2009-1	131	11	8.59	91.41	7  
16842	2009-2	160	16	10.46	89.54	7  
16842	2010-1	143	10	7.63	92.37	7  
16842	2010-2	119	17	10.62	89.38	7  
16842	2011-1	164	18	12.59	87.41	7  
16842	2011-2	140	4	3.36	96.64	7  
16842	2012-1	191	7	4.27	95.73	7  
16842	2012-2	157	5	3.57	96.43	7  
16842	2013-1	198	17	8.90	91.10	7  
16842	2013-2	165	8	5.10	94.90	7  
16842	2014-1	205	15	7.58	92.42	7  
16842	2014-2	179	5	3.03	96.97	7  
16842	2015-1	223	14	6.83	93.17	7  
16842	2015-2	199	8	4.47	95.53	7  
16842	2016-1	0	19	8.52	91.48	7  
16842	2016-2	0	14	7.04	92.96	7  
16841	2008-1	147	5	3.27	96.73	7  
16841	2008-2	181	10	5.62	94.38	7  
16841	2009-1	151	2	1.36	98.64	7  
16841	2009-2	158	14	7.73	92.27	7  
16841	2010-1	138	11	7.28	92.72	7  
16841	2010-2	173	12	7.59	92.41	7  
16841	2011-1	153	11	7.97	92.03	7  
16841	2011-2	189	7	4.05	95.95	7  
16841	2012-1	172	5	3.27	96.73	7  
16841	2012-2	196	11	5.82	94.18	7  
16841	2013-1	169	4	2.33	97.67	7  
16841	2013-2	208	10	5.10	94.90	7  
16841	2014-1	183	6	3.55	96.45	7  
16841	2014-2	203	5	2.40	97.60	7  
16841	2015-1	174	5	2.73	97.27	7  
16841	2015-2	233	15	7.39	92.61	7  
16841	2016-1	0	4	2.30	97.70	7  
16841	2016-2	0	14	6.01	93.99	7  
101305	2015-1	62	0	0.00	0.00	7  
101305	2015-2	58	0	0.00	0.00	7  
101305	2016-1	0	4	6.45	93.55	7  
101305	2016-2	0	1	1.72	98.28	7  
783	2009-1	104	10	9.26	90.74	7  
783	2009-2	141	22	16.18	83.82	7  
783	2010-1	111	12	11.54	88.46	7  
783	2010-2	83	30	21.28	78.72	7  
783	2011-1	127	28	25.23	74.77	7  
783	2011-2	92	3	3.61	96.39	7  
783	2012-1	143	21	16.54	83.46	7  
783	2012-2	119	4	4.35	95.65	7  
783	2013-1	154	16	11.19	88.81	7  
783	2013-2	107	8	6.72	93.28	7  
783	2014-1	149	34	22.08	77.92	7  
783	2014-2	126	4	3.74	96.26	7  
783	2015-1	163	20	13.42	86.58	7  
783	2015-2	134	17	13.49	86.51	7  
783	2016-1	0	32	19.63	80.37	7  
783	2016-2	0	18	13.43	86.57	7  
779	2008-1	170	18	10.29	89.71	7  
779	2008-2	196	16	7.96	92.04	7  
779	2009-1	172	15	8.82	91.18	7  
779	2009-2	198	10	5.10	94.90	7  
779	2010-1	184	14	8.14	91.86	7  
779	2010-2	219	14	7.07	92.93	7  
779	2011-1	180	16	8.70	91.30	7  
779	2011-2	222	11	5.02	94.98	7  
779	2012-1	199	4	2.22	97.78	7  
779	2012-2	237	17	7.66	92.34	7  
779	2013-1	216	9	4.52	95.48	7  
779	2013-2	254	15	6.33	93.67	7  
779	2014-1	230	14	6.48	93.52	7  
779	2014-2	264	18	7.09	92.91	7  
779	2015-1	239	5	2.17	97.83	7  
779	2015-2	280	17	6.44	93.56	7  
779	2016-1	0	17	7.11	92.89	7  
779	2016-2	0	18	6.43	93.57	7  
20824	2008-1	126	6	6.00	94.00	7  
20824	2008-2	173	13	8.84	91.16	7  
20824	2009-1	142	7	5.56	94.44	7  
20824	2009-2	195	18	10.40	89.60	7  
20824	2010-1	165	2	1.41	98.59	7  
20824	2010-2	211	16	8.21	91.79	7  
20824	2011-1	176	15	9.09	90.91	7  
20824	2011-2	230	15	7.11	92.89	7  
20824	2012-1	196	8	4.55	95.45	7  
20824	2012-2	246	8	3.48	96.52	7  
20824	2013-1	189	9	4.59	95.41	7  
20824	2013-2	242	24	9.76	90.24	7  
20824	2014-1	195	10	5.29	94.71	7  
20824	2014-2	259	18	7.44	92.56	7  
20824	2015-1	224	4	2.05	97.95	7  
20824	2015-2	293	14	5.41	94.59	7  
20824	2016-1	0	9	4.02	95.98	7  
20824	2016-2	0	14	4.78	95.22	7  
2887	2008-1	198	13	6.50	93.50	7  
2887	2008-2	170	3	1.80	98.20	7  
2887	2009-1	207	19	9.60	90.40	7  
2887	2009-2	220	7	4.12	95.88	7  
2887	2010-1	201	15	7.25	92.75	7  
2887	2010-2	186	6	2.73	97.27	7  
2887	2011-1	217	24	11.94	88.06	7  
2887	2011-2	181	2	1.08	98.92	7  
2887	2012-1	209	16	7.37	92.63	7  
2887	2012-2	176	7	3.87	96.13	7  
2887	2013-1	212	13	6.22	93.78	7  
2887	2013-2	186	3	1.70	98.30	7  
2887	2014-1	223	18	8.49	91.51	7  
2887	2014-2	190	4	2.15	97.85	7  
2887	2015-1	221	15	6.73	93.27	7  
2887	2015-2	203	9	4.74	95.26	7  
2887	2016-1	0	17	7.69	92.31	7  
2887	2016-2	0	16	7.88	92.12	7  
91489	2012-1	54	0	0.00	0.00	7  
91489	2012-2	43	0	0.00	0.00	7  
91489	2013-1	91	10	18.52	81.48	7  
91489	2013-2	75	3	6.98	93.02	7  
91489	2014-1	118	15	16.48	83.52	7  
91489	2014-2	108	2	2.67	97.33	7  
91489	2015-1	168	8	6.78	93.22	7  
91489	2015-2	148	4	3.70	96.30	7  
91489	2016-1	0	18	10.71	89.29	7  
91489	2016-2	0	3	2.03	97.97	7  
3928	2010-1	206	2	0.84	99.16	7  
3928	2010-2	182	14	6.11	93.89	7  
3928	2011-1	224	12	5.83	94.17	7  
3928	2011-2	178	3	1.65	98.35	7  
3928	2012-1	245	11	4.91	95.09	7  
3928	2012-2	200	7	3.93	96.07	7  
3928	2013-1	227	14	5.71	94.29	7  
3928	2013-2	209	6	3.00	97.00	7  
3928	2014-1	233	5	2.20	97.80	7  
3928	2014-2	219	7	3.35	96.65	7  
3928	2015-1	268	8	3.43	96.57	7  
3928	2015-2	249	6	2.74	97.26	7  
3928	2016-1	0	13	4.85	95.15	7  
3928	2016-2	0	14	5.62	94.38	7  
4492	2008-1	131	5	4.10	95.90	7  
4492	2008-2	170	22	13.25	86.75	7  
4492	2009-1	144	11	8.40	91.60	7  
4492	2009-2	169	21	12.35	87.65	7  
4492	2010-1	144	12	8.33	91.67	7  
4492	2010-2	108	25	14.79	85.21	7  
4492	2011-1	141	33	22.92	77.08	7  
4492	2011-2	107	7	6.48	93.52	7  
4492	2012-1	150	26	18.44	81.56	7  
4492	2012-2	116	8	7.48	92.52	7  
4492	2013-1	155	24	16.00	84.00	7  
4492	2013-2	133	5	4.31	95.69	7  
4492	2014-1	166	17	10.97	89.03	7  
4492	2014-2	130	9	6.77	93.23	7  
4492	2015-1	181	26	15.66	84.34	7  
4492	2015-2	142	12	9.23	90.77	7  
4492	2016-1	0	36	19.89	80.11	7  
4492	2016-2	0	8	5.63	94.37	7  
3319	2008-1	158	6	4.29	95.71	7  
3319	2008-2	187	17	9.19	90.81	7  
3319	2009-1	158	6	3.80	96.20	7  
3319	2009-2	177	18	9.63	90.37	7  
3319	2010-1	167	6	3.80	96.20	7  
3319	2010-2	175	14	7.91	92.09	7  
3319	2011-1	165	29	17.37	82.63	7  
3319	2011-2	196	9	5.14	94.86	7  
3319	2012-1	186	1	0.61	99.39	7  
3319	2012-2	223	27	13.78	86.22	7  
3319	2013-1	194	7	3.76	96.24	7  
3319	2013-2	222	25	11.21	88.79	7  
3319	2014-1	187	6	3.09	96.91	7  
3319	2014-2	228	9	4.05	95.95	7  
3319	2015-1	195	6	3.21	96.79	7  
3319	2015-2	188	18	7.89	92.11	7  
3319	2016-1	0	12	6.15	93.85	7  
3319	2016-2	0	22	11.70	88.30	7  
3189	2008-1	116	11	8.59	91.41	7  
3189	2008-2	108	30	20.69	79.31	7  
3189	2009-1	80	10	8.62	91.38	7  
3189	2009-2	112	12	11.11	88.89	7  
3189	2010-1	99	5	6.25	93.75	7  
3189	2010-2	112	10	8.93	91.07	7  
3189	2011-1	92	20	20.20	79.80	7  
3189	2011-2	117	15	13.39	86.61	7  
3189	2012-1	84	3	3.26	96.74	7  
3189	2012-2	120	25	21.37	78.63	7  
3189	2013-1	83	5	5.95	94.05	7  
3189	2013-2	112	35	29.17	70.83	7  
3189	2014-1	82	8	9.64	90.36	7  
3189	2014-2	61	26	23.21	76.79	7  
3189	2015-1	47	5	6.10	93.90	7  
3189	2015-2	22	14	22.95	77.05	7  
3189	2016-1	0	2	4.26	95.74	7  
3189	2016-2	0	3	13.64	86.36	7  
8405	2008-1	143	8	5.84	94.16	7  
8405	2008-2	138	27	15.70	84.30	7  
8405	2009-1	107	6	4.20	95.80	7  
8405	2009-2	136	28	20.29	79.71	7  
8405	2010-1	107	13	12.15	87.85	7  
8405	2010-2	72	22	16.18	83.82	7  
8405	2011-1	117	23	21.50	78.50	7  
8405	2011-2	53	4	5.56	94.44	7  
8405	2012-1	92	17	14.53	85.47	7  
8405	2012-2	85	6	11.32	88.68	7  
8405	2013-1	107	7	7.61	92.39	7  
8405	2013-2	95	13	15.29	84.71	7  
8405	2014-1	100	12	11.21	88.79	7  
8405	2014-2	90	7	7.37	92.63	7  
8405	2015-1	109	9	9.00	91.00	7  
8405	2015-2	99	4	4.44	95.56	7  
8405	2016-1	0	11	10.09	89.91	7  
8405	2016-2	0	3	3.03	96.97	7  
777	2008-1	170	9	5.56	94.44	7  
777	2008-2	189	20	10.58	89.42	7  
777	2009-1	165	11	6.47	93.53	7  
777	2009-2	185	11	5.82	94.18	7  
777	2010-1	180	3	1.82	98.18	7  
777	2010-2	135	11	5.95	94.05	7  
777	2011-1	178	35	19.44	80.56	7  
777	2011-2	145	3	2.22	97.78	7  
777	2012-1	193	12	6.74	93.26	7  
777	2012-2	155	6	4.14	95.86	7  
777	2013-1	191	20	10.36	89.64	7  
777	2013-2	161	5	3.23	96.77	7  
777	2014-1	178	24	12.57	87.43	7  
777	2014-2	163	9	5.59	94.41	7  
777	2015-1	209	12	6.74	93.26	7  
777	2015-2	163	6	3.68	96.32	7  
777	2016-1	0	30	14.35	85.65	7  
777	2016-2	0	4	2.45	97.55	7  
1206	2010-1	7753	406	5.49	94.51	7  
1206	2010-2	7495	733	8.66	91.34	7  
1206	2011-1	7494	1144	14.76	85.24	7  
1206	2011-2	7465	353	4.71	95.29	7  
1206	2012-1	8174	398	5.31	94.69	7  
1206	2012-2	8281	477	6.39	93.61	7  
1206	2013-1	7685	526	6.44	93.56	7  
1206	2013-2	8182	591	7.14	92.86	7  
1206	2014-1	8353	544	7.08	92.92	7  
1206	2014-2	8451	465	5.68	94.32	7  
1206	2015-1	8909	484	5.79	94.21	7  
1206	2015-2	9124	553	6.54	93.46	7  
1206	2016-1	0	693	7.78	92.22	7  
1206	2016-2	0	720	7.89	92.11	7  
\.
COPY "KPI_Estudiantes_por_Docentes_TC" (departamento, "Anho", estudiantes, docentes, razonanual, razona, razonb, "manual_Estu_Docente") FROM stdin;
\.
COPY "KPI_Formacion" (formacion, t_completo, t_ocasional, hora_catedra, anio, "manual_Formacion", estado_meta) FROM stdin;
1 	47	1	0	2010	2  	71.59
2 	147	18	37	2010	2  	71.59
3 	61	21	191	2010	2  	71.59
4 	16	19	239	2010	2  	71.59
1 	50	0	4	2011	2  	74.91
2 	150	14	73	2011	2  	74.91
3 	54	22	210	2011	2  	74.91
4 	13	21	164	2011	2  	74.91
1 	59	0	5	2012	2  	80.52
2 	156	17	79	2012	2  	80.52
3 	40	16	227	2012	2  	80.52
4 	12	25	160	2012	2  	80.52
1 	66	0	2	2013	2  	83.70
2 	160	17	107	2013	2  	83.70
3 	35	27	196	2013	2  	83.70
4 	9	20	171	2013	2  	83.70
1 	74	1	3	2014	2  	85.93
2 	158	9	121	2014	2  	85.93
3 	28	13	197	2014	2  	85.93
4 	10	11	172	2014	2  	85.93
1 	80	0	8	2015	2  	85.77
2 	155	21	134	2015	2  	85.77
3 	30	23	194	2015	2  	85.77
4 	9	14	174	2015	2  	85.77
1 	98	0	10	2016	2  	89.93
2 	143	14	138	2016	2  	89.93
3 	21	28	180	2016	2  	89.93
4 	6	11	198	2016	2  	89.93
1 	98	2	8	2017	2  	90.00
2 	141	11	138	2017	2  	90.00
3 	20	23	190	2017	2  	90.00
4 	6	14	214	2017	2  	90.00
\.
COPY "KPI_Nivel_Satisfaccion" ("Programa", "Nivel", "Anho", manual) FROM stdin;
786	93.00	2015	1  
3189	75.00	2015	1  
3227	81.71	2016	1  
4282	97.80	2015	1  
92400	96	2016	1  
16842	79.20	2015	1  
105002	84.00	2015	1  
92400	98	2017-1	1  
789	100	2016	1  
16841	86.24	2016	1  
91489	84.44	2016	1  
11632	100	2016	1  
12696	96.55	2016	1  
790	98.46	2016	1  
783	97.83	2016	1  
20824	90.91	2016	1  
8405	94.29	2016	1  
3928	97.56	2016	1  
3426	85.71	2016	1  
101558	78.18	2016	1  
4492	89.47	2016	1  
3318	88.89	2016	1  
6564	100	2016	1  
19127	84.75	2016	1  
6566	100	2016	1  
16843	92.42	2016	1  
2887	89.74	2016	1  
788	67.8	2016	1  
103814	88.31	2016	1  
90839	81.71	2016	1  
3474	94.55	2016	1  
777	79.31	2016	1  
578	88.14	2016	1  
90860	65.15	2016	1  
2972	95.56	2016	1  
3319	60	2016	1  
779	89.29	2016	1  
91280	100	2016	1  
4095	85.19	2016	1  
4096	59.46	2016	1  
16840	60.38	2016	1  
2715	62.07	2016	1  
4282	93	2016	1  
16837	96.3	2016	1  
105565	100	2016	1  
101575	98.36	2016	1  
101580	100	2016	1  
101579	100	2016	1  
16839	92.54	2016	1  
16842	96.45	2016	1  
786	96.55	2016	1  
789	100	2015	1  
16841	100	2015	1  
91489	100	2015	1  
11632	98	2015	1  
12696	96	2015	1  
790	96	2015	1  
783	96	2015	1  
20824	94	2015	1  
8405	94	2015	1  
3928	93	2015	1  
3426	92	2015	1  
16839	92	2015	1  
4492	91	2015	1  
3318	89	2015	1  
6564	88	2015	1  
19127	87	2015	1  
6566	87	2015	1  
16843	87	2015	1  
2887	87	2015	1  
788	86	2015	1  
103814	86	2015	1  
90839	83	2015	1  
3474	82	2015	1  
777	82	2015	1  
578	80	2015	1  
90860	77	2015	1  
2972	77	2015	1  
3319	75	2015	1  
779	73	2015	1  
91280	71	2015	1  
4095	66	2015	1  
4096	64	2015	1  
16840	63	2015	1  
2715	46	2015	1  
4282	97.8	2014	1  
777	96	2014	1  
4096	94.9	2014	1  
3928	93	2014	1  
6564	93	2014	1  
6566	92	2014	1  
8405	88	2014	1  
11632	88	2014	1  
789	87	2014	1  
12696	86.58	2014	1  
90839	85.5	2014	1  
790	84	2014	1  
105002	84	2014	1  
578	84	2014	1  
783	80	2014	1  
20824	80	2014	1  
3474	80	2014	1  
16842	79.2	2014	1  
16843	79.2	2014	1  
16841	79	2014	1  
3319	77	2014	1  
16839	76	2014	1  
3189	75	2014	1  
2887	75	2014	1  
4492	74.49	2014	1  
2972	73	2014	1  
91489	71.6	2014	1  
19127	69	2014	1  
103814	63	2014	1  
2715	57	2014	1  
91280	55	2014	1  
788	53.92	2014	1  
4095	50	2014	1  
90860	37	2014	1  
1206	77.59	2014	1  
1206	85	2015	1  
1206	87.2	2016	1  
788	99.4	2017-1	1  
105565	100	2017-1	1  
19127	98.25	2017-1	1  
4096	100	2017-1	1  
3426	98.81	2017-1	1  
90839	100	2017-1	1  
90860	99.02	2017-1	1  
786	100	2017-1	1  
103814	100	2017-1	1  
4095	100	2017-1	1  
12696	96.3	2017-1	1  
578	99.09	2017-1	1  
3318	90.48	2017-1	1  
6564	94.12	2017-1	1  
790	96.61	2017-1	1  
91280	100	2017-1	1  
789	100	2017-1	1  
101575	98.36	2017-1	1  
101580	100	2017-1	1  
3474	100	2017-1	1  
101579	100	2017-1	1  
11632	100	2017-1	1  
6566	100	2017-1	1  
16840	100	2017-1	1  
16839	92.54	2017-1	1  
16837	100	2017-1	1  
16843	98.88	2017-1	1  
2715	100	2017-1	1  
2972	100	2017-1	1  
16842	100	2017-1	1  
16841	100	2017-1	1  
783	100	2017-1	1  
779	100	2017-1	1  
20824	100	2017-1	1  
2887	98.48	2017-1	1  
91489	97.3	2017-1	1  
3928	98.79	2017-1	1  
4492	100	2017-1	1  
3319	100	2017-1	1  
8405	100	2017-1	1  
777	100	2017-1	1  
1206	98.97	2017-1	1  
\.
COPY "KPI_Relacion_Docentes" (anio, cant_docentes_tc, cant_docentes_hc, relacion_docentes, "manual_Rela") FROM stdin;
2010 	271	467	1.72	3  
2011 	267	451	1.69	3  
2012 	267	471	1.76	3  
2013 	270	476	1.76	3  
2014 	270	493	1.83	3  
2015 	274	510	1.86	3  
2016 	268	526	1.96	3  
2017 	265	550	2.08	3  
\.
SET search_path = public, pg_catalog;
COPY acreditacion_alta_calidad (resolucion, programa, inicioacreditacion, periodo, activo, aviso, gravedad, mail, chkpm1, mailpm1, chkaev1, mailaev1, chkpm2, mailpm2, chkaev2, mailaev2, chkmen, mailmen) FROM stdin;
583	3928	2015-01-09	4	t	14	1	t	f	f	f	f	f	f	f	f	f	f
581	16843	2015-01-09	4	t	13	1	t	f	f	f	f	f	f	f	f	f	f
1956	790	2013-02-28	6	t	5	1	t	f	f	f	f	f	f	f	f	f	f
11964	4096	2016-06-16	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
10703	2715	2017-05-25	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
10724	105002	2017-05-25	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
11218	16840	2017-06-01	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
1236	789	2011-02-21	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
1237	4492	2011-02-21	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
14315	777	2015-09-07	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
16038	3426	2012-12-10	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
17493	16842	2016-08-30	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
3603	16839	2009-06-02	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
4560	12696	2013-04-25	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
5612	16841	2009-08-25	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
5613	6564	2009-08-25	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
6288	4282	2006-10-13	7	f	99	0	f	f	f	f	f	f	f	f	f	f	f
6797	3474	2010-08-06	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
6804	3928	2010-08-06	4	f	99	0	f	f	f	f	f	f	f	f	f	f	f
7755	4282	2014-05-26	6	t	99	0	f	f	f	f	f	f	f	f	f	f	f
20128	11632	2015-12-10	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
11724	2972	2017-06-09	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
1470	789	2017-02-06	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
9811	8405	2013-07-31	4	f	16	2	f	f	f	f	f	f	f	f	f	f	t
2160	786	2016-02-05	6	t	99	0	f	f	t	f	f	f	f	f	f	f	f
13751	16839	2015-09-02	6	t	99	0	f	f	f	f	t	f	f	f	f	f	f
13753	16841	2015-09-02	4	t	99	0	f	f	t	f	f	f	f	f	f	f	f
13752	783	2015-09-02	4	t	99	0	f	f	t	f	f	f	f	f	f	f	f
14781	12696	2017-07-28	4	t	99	0	f	f	f	f	f	f	f	f	f	f	f
9233	6564	2015-06-26	4	t	27	1	t	f	f	f	f	f	f	f	f	f	f
\.
COPY estudiantes_departamento (cod_est_dep, departamento, matriculados, anho, periodo) FROM stdin;
\.
COPY formacion (cod_formacion, nom_formacion) FROM stdin;
1 	Doctor
3 	Especialista
4 	Profesional
2 	Magíster
\.
COPY formacion_departamento (cod_forma_dep, departamento, t_completo, t_ocasional, hora_catedra, anio, periodo, formacion) FROM stdin;
1	4 	0	0	0	2010	1 	1 
2	4 	2	0	0	2010	1 	2 
3	4 	3	1	3	2010	1 	3 
4	4 	1	1	8	2010	1 	4 
5	1 	2	0	0	2010	1 	1 
6	1 	4	1	1	2010	1 	2 
7	1 	4	0	5	2010	1 	3 
8	1 	2	0	5	2010	1 	4 
9	2 	0	0	0	2010	1 	1 
10	2 	3	0	1	2010	1 	2 
11	2 	4	2	1	2010	1 	3 
12	2 	2	1	16	2010	1 	4 
13	3 	0	0	0	2010	1 	1 
14	3 	2	1	0	2010	1 	2 
15	3 	4	2	2	2010	1 	3 
16	3 	3	2	26	2010	1 	4 
17	5 	2	0	0	2010	1 	1 
18	5 	8	2	3	2010	1 	2 
19	5 	0	2	2	2010	1 	3 
20	5 	0	0	7	2010	1 	4 
21	6 	3	0	0	2010	1 	1 
22	6 	6	1	0	2010	1 	2 
23	6 	0	1	2	2010	1 	3 
24	6 	0	0	0	2010	1 	4 
25	16	0	0	0	2010	1 	1 
26	16	4	1	1	2010	1 	2 
27	16	0	0	3	2010	1 	3 
28	16	0	0	5	2010	1 	4 
29	17	0	0	0	2010	1 	1 
30	17	0	0	4	2010	1 	2 
31	17	1	1	24	2010	1 	3 
32	17	0	0	29	2010	1 	4 
33	7 	0	0	0	2010	1 	1 
34	7 	5	0	0	2010	1 	2 
35	7 	3	4	4	2010	1 	3 
36	7 	1	2	9	2010	1 	4 
37	8 	1	0	0	2010	1 	1 
38	8 	2	0	0	2010	1 	2 
39	8 	2	2	12	2010	1 	3 
40	8 	0	0	9	2010	1 	4 
41	9 	1	0	0	2010	1 	1 
42	9 	3	0	0	2010	1 	2 
43	9 	1	1	7	2010	1 	3 
44	9 	0	0	6	2010	1 	4 
45	10	1	0	0	2010	1 	1 
46	10	5	2	3	2010	1 	2 
47	10	0	1	0	2010	1 	3 
48	10	0	0	4	2010	1 	4 
49	11	1	0	0	2010	1 	1 
50	11	11	1	1	2010	1 	2 
51	11	0	0	0	2010	1 	3 
52	11	0	1	1	2010	1 	4 
53	12	1	0	0	2010	1 	1 
54	12	2	0	0	2010	1 	2 
55	12	3	0	0	2010	1 	3 
56	12	0	0	2	2010	1 	4 
57	13	3	0	0	2010	1 	1 
58	13	11	0	4	2010	1 	2 
59	13	2	0	10	2010	1 	3 
60	13	0	0	52	2010	1 	4 
61	14	2	0	0	2010	1 	1 
62	14	2	1	3	2010	1 	2 
63	14	2	1	3	2010	1 	3 
64	14	0	2	8	2010	1 	4 
65	15	1	0	0	2010	1 	1 
66	15	3	0	2	2010	1 	2 
67	15	1	0	3	2010	1 	3 
68	15	0	0	2	2010	1 	4 
69	18	3	0	0	2010	1 	1 
70	18	6	3	0	2010	1 	2 
71	18	2	0	1	2010	1 	3 
72	18	0	1	9	2010	1 	4 
73	19	4	0	0	2010	1 	1 
74	19	5	0	2	2010	1 	2 
75	19	1	0	3	2010	1 	3 
76	19	0	0	11	2010	1 	4 
77	20	0	0	0	2010	1 	1 
78	20	17	1	4	2010	1 	2 
79	20	7	2	9	2010	1 	3 
80	20	1	1	18	2010	1 	4 
81	21	5	0	0	2010	1 	1 
82	21	6	1	1	2010	1 	2 
83	21	0	0	6	2010	1 	3 
84	21	0	1	4	2010	1 	4 
85	28	2	0	0	2010	1 	1 
86	28	4	0	0	2010	1 	2 
87	28	1	1	1	2010	1 	3 
88	28	1	0	7	2010	1 	4 
89	29	0	0	0	2010	1 	1 
90	29	4	0	0	2010	1 	2 
91	29	3	0	3	2010	1 	3 
92	29	1	0	6	2010	1 	4 
93	30	1	0	0	2010	1 	1 
94	30	1	0	0	2010	1 	2 
95	30	2	0	2	2010	1 	3 
96	30	1	0	2	2010	1 	4 
97	22	2	0	0	2010	1 	1 
98	22	3	0	6	2010	1 	2 
99	22	2	0	7	2010	1 	3 
100	22	1	0	9	2010	1 	4 
101	23	6	0	0	2010	1 	1 
102	23	8	3	3	2010	1 	2 
103	23	1	0	2	2010	1 	3 
104	23	0	0	9	2010	1 	4 
105	24	1	0	0	2010	1 	1 
106	24	3	0	1	2010	1 	2 
107	24	6	0	4	2010	1 	3 
108	24	1	0	8	2010	1 	4 
109	25	1	0	0	2010	1 	1 
110	25	3	1	0	2010	1 	2 
111	25	5	2	7	2010	1 	3 
112	25	0	1	16	2010	1 	4 
113	26	0	0	0	2010	1 	1 
114	26	6	1	0	2010	1 	2 
115	26	0	0	1	2010	1 	3 
116	26	0	1	7	2010	1 	4 
117	27	2	0	0	2010	1 	1 
118	27	4	0	0	2010	1 	2 
119	27	0	1	1	2010	1 	3 
120	27	1	0	11	2010	1 	4 
121	4 	0	0	0	2010	2 	1 
122	4 	2	0	0	2010	2 	2 
123	4 	3	0	5	2010	2 	3 
124	4 	1	2	6	2010	2 	4 
125	1 	2	0	0	2010	2 	1 
126	1 	4	1	1	2010	2 	2 
127	1 	4	0	7	2010	2 	3 
128	1 	2	0	4	2010	2 	4 
129	2 	0	0	0	2010	2 	1 
130	2 	4	0	1	2010	2 	2 
131	2 	4	2	9	2010	2 	3 
132	2 	1	1	5	2010	2 	4 
133	3 	0	0	0	2010	2 	1 
134	3 	3	1	1	2010	2 	2 
135	3 	3	2	5	2010	2 	3 
136	3 	3	2	25	2010	2 	4 
137	5 	3	0	0	2010	2 	1 
138	5 	7	2	3	2010	2 	2 
139	5 	0	2	2	2010	2 	3 
140	5 	0	0	4	2010	2 	4 
141	6 	3	0	0	2010	2 	1 
142	6 	6	1	0	2010	2 	2 
143	6 	1	0	0	2010	2 	3 
144	6 	0	1	3	2010	2 	4 
145	16	0	0	0	2010	2 	1 
146	16	5	0	1	2010	2 	2 
147	16	0	0	3	2010	2 	3 
148	16	0	0	4	2010	2 	4 
149	17	0	0	0	2010	2 	1 
150	17	2	0	4	2010	2 	2 
151	17	0	0	34	2010	2 	3 
152	17	0	1	20	2010	2 	4 
153	7 	0	0	0	2010	2 	1 
154	7 	5	0	0	2010	2 	2 
155	7 	4	4	4	2010	2 	3 
156	7 	1	2	7	2010	2 	4 
157	8 	1	0	0	2010	2 	1 
158	8 	2	0	0	2010	2 	2 
159	8 	2	2	11	2010	2 	3 
160	8 	0	0	10	2010	2 	4 
161	9 	1	0	0	2010	2 	1 
162	9 	2	0	0	2010	2 	2 
163	9 	1	1	7	2010	2 	3 
164	9 	0	1	3	2010	2 	4 
165	10	1	0	0	2010	2 	1 
166	10	5	1	3	2010	2 	2 
167	10	0	0	1	2010	2 	3 
168	10	0	0	4	2010	2 	4 
169	11	1	0	0	2010	2 	1 
170	11	11	1	1	2010	2 	2 
171	11	0	0	0	2010	2 	3 
172	11	0	1	2	2010	2 	4 
173	12	1	0	0	2010	2 	1 
174	12	2	0	0	2010	2 	2 
175	12	3	0	2	2010	2 	3 
176	12	0	0	3	2010	2 	4 
177	13	4	0	0	2010	2 	1 
178	13	9	2	1	2010	2 	2 
179	13	3	1	13	2010	2 	3 
180	13	0	0	46	2010	2 	4 
181	14	2	0	0	2010	2 	1 
182	14	2	1	5	2010	2 	2 
183	14	2	1	5	2010	2 	3 
184	14	0	2	4	2010	2 	4 
185	15	1	0	0	2010	2 	1 
186	15	3	0	0	2010	2 	2 
187	15	2	0	4	2010	2 	3 
188	15	1	0	2	2010	2 	4 
189	18	3	0	0	2010	2 	1 
190	18	7	2	1	2010	2 	2 
191	18	2	0	1	2010	2 	3 
192	18	0	1	8	2010	2 	4 
193	19	4	0	0	2010	2 	1 
194	19	5	0	2	2010	2 	2 
195	19	1	0	4	2010	2 	3 
196	19	0	0	7	2010	2 	4 
197	20	0	0	0	2010	2 	1 
198	20	17	1	5	2010	2 	2 
199	20	7	2	15	2010	2 	3 
200	20	1	2	15	2010	2 	4 
201	21	5	0	0	2010	2 	1 
202	21	6	1	0	2010	2 	2 
203	21	0	0	8	2010	2 	3 
204	21	0	1	7	2010	2 	4 
205	28	3	0	0	2010	2 	1 
206	28	3	0	1	2010	2 	2 
207	28	1	0	5	2010	2 	3 
208	28	1	0	4	2010	2 	4 
209	29	0	0	0	2010	2 	1 
210	29	4	0	0	2010	2 	2 
211	29	3	0	4	2010	2 	3 
212	29	1	0	1	2010	2 	4 
213	30	1	0	0	2010	2 	1 
214	30	1	0	1	2010	2 	2 
215	30	2	0	2	2010	2 	3 
216	30	1	0	6	2010	2 	4 
217	22	2	0	0	2010	2 	1 
218	22	3	0	4	2010	2 	2 
219	22	2	0	9	2010	2 	3 
220	22	1	0	6	2010	2 	4 
221	23	5	0	0	2010	2 	1 
222	23	9	2	2	2010	2 	2 
223	23	1	0	8	2010	2 	3 
224	23	0	0	2	2010	2 	4 
225	24	1	1	0	2010	2 	1 
226	24	3	0	0	2010	2 	2 
227	24	6	0	7	2010	2 	3 
228	24	1	1	6	2010	2 	4 
229	25	1	0	0	2010	2 	1 
230	25	4	1	0	2010	2 	2 
231	25	4	2	13	2010	2 	3 
232	25	0	0	4	2010	2 	4 
233	26	0	0	0	2010	2 	1 
234	26	7	1	0	2010	2 	2 
235	26	0	0	1	2010	2 	3 
236	26	0	1	10	2010	2 	4 
237	27	2	0	0	2010	2 	1 
238	27	4	0	0	2010	2 	2 
239	27	0	2	2	2010	2 	3 
240	27	1	0	11	2010	2 	4 
241	4 	0	0	0	2011	1 	1 
242	4 	2	0	1	2011	1 	2 
243	4 	3	1	7	2011	1 	3 
244	4 	1	1	4	2011	1 	4 
245	1 	2	0	0	2011	1 	1 
246	1 	5	1	3	2011	1 	2 
247	1 	4	0	9	2011	1 	3 
248	1 	1	0	0	2011	1 	4 
249	2 	1	0	0	2011	1 	1 
250	2 	3	0	1	2011	1 	2 
251	2 	4	1	14	2011	1 	3 
252	2 	1	1	3	2011	1 	4 
253	3 	0	0	0	2011	1 	1 
254	3 	2	1	1	2011	1 	2 
255	3 	2	2	3	2011	1 	3 
256	3 	3	2	25	2011	1 	4 
257	5 	3	0	0	2011	1 	1 
258	5 	7	2	4	2011	1 	2 
259	5 	0	1	3	2011	1 	3 
260	5 	0	1	4	2011	1 	4 
261	6 	3	0	0	2011	1 	1 
262	6 	7	1	2	2011	1 	2 
263	6 	0	0	0	2011	1 	3 
264	6 	0	1	3	2011	1 	4 
265	16	0	0	0	2011	1 	1 
266	16	5	0	3	2011	1 	2 
267	16	0	0	4	2011	1 	3 
268	16	0	0	0	2011	1 	4 
269	17	0	0	0	2011	1 	1 
270	17	1	0	5	2011	1 	2 
271	17	1	0	36	2011	1 	3 
272	17	0	1	6	2011	1 	4 
273	7 	0	0	0	2011	1 	1 
274	7 	4	0	5	2011	1 	2 
275	7 	4	4	8	2011	1 	3 
276	7 	2	2	1	2011	1 	4 
277	8 	1	0	0	2011	1 	1 
278	8 	2	1	0	2011	1 	2 
279	8 	2	0	19	2011	1 	3 
280	8 	0	0	1	2011	1 	4 
281	9 	1	0	0	2011	1 	1 
282	9 	2	0	2	2011	1 	2 
283	9 	1	0	9	2011	1 	3 
284	9 	0	0	1	2011	1 	4 
285	10	1	0	0	2011	1 	1 
286	10	5	0	4	2011	1 	2 
287	10	0	0	1	2011	1 	3 
288	10	0	0	3	2011	1 	4 
289	11	1	0	0	2011	1 	1 
290	11	10	1	3	2011	1 	2 
291	11	0	0	0	2011	1 	3 
292	11	0	1	0	2011	1 	4 
293	12	1	0	0	2011	1 	1 
294	12	2	0	0	2011	1 	2 
295	12	3	1	0	2011	1 	3 
296	12	0	1	1	2011	1 	4 
297	13	5	0	1	2011	1 	1 
298	13	8	2	3	2011	1 	2 
299	13	3	1	22	2011	1 	3 
300	13	0	0	39	2011	1 	4 
301	14	2	0	0	2011	1 	1 
302	14	2	1	4	2011	1 	2 
303	14	2	0	7	2011	1 	3 
304	14	0	3	3	2011	1 	4 
305	15	1	0	0	2011	1 	1 
306	15	4	0	0	2011	1 	2 
307	15	2	0	2	2011	1 	3 
308	15	0	0	2	2011	1 	4 
309	18	4	0	0	2011	1 	1 
310	18	5	1	4	2011	1 	2 
311	18	2	0	4	2011	1 	3 
312	18	0	0	6	2011	1 	4 
313	19	4	0	0	2011	1 	1 
314	19	5	0	4	2011	1 	2 
315	19	1	0	3	2011	1 	3 
316	19	0	0	7	2011	1 	4 
317	20	0	0	0	2011	1 	1 
318	20	20	0	6	2011	1 	2 
319	20	4	2	15	2011	1 	3 
320	20	1	2	13	2011	1 	4 
321	21	5	0	0	2011	1 	1 
322	21	6	2	1	2011	1 	2 
323	21	0	0	6	2011	1 	3 
324	21	0	0	6	2011	1 	4 
325	28	3	0	0	2011	1 	1 
326	28	3	1	2	2011	1 	2 
327	28	1	0	5	2011	1 	3 
328	28	1	0	1	2011	1 	4 
329	29	0	0	0	2011	1 	1 
330	29	4	0	0	2011	1 	2 
331	29	3	0	7	2011	1 	3 
332	29	1	0	5	2011	1 	4 
333	30	1	0	0	2011	1 	1 
334	30	2	0	2	2011	1 	2 
335	30	1	0	1	2011	1 	3 
336	30	1	0	4	2011	1 	4 
337	22	2	0	0	2011	1 	1 
338	22	3	0	6	2011	1 	2 
339	22	3	0	7	2011	1 	3 
340	22	0	0	4	2011	1 	4 
341	23	5	0	1	2011	1 	1 
342	23	9	2	8	2011	1 	2 
343	23	1	0	2	2011	1 	3 
344	23	0	0	2	2011	1 	4 
345	24	1	0	1	2011	1 	1 
346	24	3	0	2	2011	1 	2 
347	24	6	0	7	2011	1 	3 
348	24	1	1	1	2011	1 	4 
349	25	1	0	0	2011	1 	1 
350	25	4	1	0	2011	1 	2 
351	25	4	1	15	2011	1 	3 
352	25	0	1	4	2011	1 	4 
353	26	0	0	0	2011	1 	1 
354	26	7	0	1	2011	1 	2 
355	26	0	1	4	2011	1 	3 
356	26	0	1	6	2011	1 	4 
357	27	2	0	0	2011	1 	1 
358	27	4	0	2	2011	1 	2 
359	27	0	1	3	2011	1 	3 
360	27	1	0	7	2011	1 	4 
361	4 	0	0	0	2011	2 	1 
362	4 	3	0	2	2011	2 	2 
363	4 	2	1	6	2011	2 	3 
364	4 	1	1	3	2011	2 	4 
365	1 	2	0	0	2011	2 	1 
366	1 	5	1	2	2011	2 	2 
367	1 	4	0	9	2011	2 	3 
368	1 	1	0	2	2011	2 	4 
369	2 	1	0	0	2011	2 	1 
370	2 	3	0	1	2011	2 	2 
371	2 	4	1	14	2011	2 	3 
372	2 	1	1	2	2011	2 	4 
373	3 	0	0	0	2011	2 	1 
374	3 	2	1	1	2011	2 	2 
375	3 	3	3	3	2011	2 	3 
376	3 	3	3	30	2011	2 	4 
377	5 	3	0	0	2011	2 	1 
378	5 	7	1	5	2011	2 	2 
379	5 	0	1	3	2011	2 	3 
380	5 	0	1	3	2011	2 	4 
381	6 	3	0	0	2011	2 	1 
382	6 	7	1	1	2011	2 	2 
383	6 	0	0	0	2011	2 	3 
384	6 	0	3	2	2011	2 	4 
385	16	0	0	0	2011	2 	1 
386	16	5	0	3	2011	2 	2 
387	16	0	0	6	2011	2 	3 
388	16	0	0	1	2011	2 	4 
389	17	0	0	0	2011	2 	1 
390	17	1	0	4	2011	2 	2 
391	17	1	0	26	2011	2 	3 
392	17	0	1	6	2011	2 	4 
393	7 	0	0	0	2011	2 	1 
394	7 	4	0	2	2011	2 	2 
395	7 	3	3	6	2011	2 	3 
396	7 	2	1	6	2011	2 	4 
397	8 	1	0	0	2011	2 	1 
398	8 	2	1	1	2011	2 	2 
399	8 	2	2	20	2011	2 	3 
400	8 	0	0	0	2011	2 	4 
401	9 	1	0	0	2011	2 	1 
402	9 	2	0	2	2011	2 	2 
403	9 	1	0	10	2011	2 	3 
404	9 	0	0	1	2011	2 	4 
405	10	0	0	0	2011	2 	1 
406	10	5	0	3	2011	2 	2 
407	10	0	0	1	2011	2 	3 
408	10	0	0	6	2011	2 	4 
409	11	1	0	1	2011	2 	1 
410	11	10	1	1	2011	2 	2 
411	11	0	0	0	2011	2 	3 
412	11	0	0	1	2011	2 	4 
413	12	1	0	0	2011	2 	1 
414	12	2	0	0	2011	2 	2 
415	12	3	1	1	2011	2 	3 
416	12	0	1	0	2011	2 	4 
417	13	5	0	1	2011	2 	1 
418	13	8	1	6	2011	2 	2 
419	13	3	0	23	2011	2 	3 
420	13	0	0	38	2011	2 	4 
421	14	2	0	0	2011	2 	1 
422	14	3	0	6	2011	2 	2 
423	14	1	2	6	2011	2 	3 
424	14	0	3	3	2011	2 	4 
425	15	1	0	0	2011	2 	1 
426	15	4	0	0	2011	2 	2 
427	15	2	0	2	2011	2 	3 
428	15	0	0	1	2011	2 	4 
429	18	4	0	1	2011	2 	1 
430	18	6	3	2	2011	2 	2 
431	18	2	0	0	2011	2 	3 
432	18	0	0	4	2011	2 	4 
433	19	5	0	0	2011	2 	1 
434	19	4	0	3	2011	2 	2 
435	19	1	0	3	2011	2 	3 
436	19	0	1	8	2011	2 	4 
437	20	0	0	0	2011	2 	1 
438	20	21	0	6	2011	2 	2 
439	20	4	2	13	2011	2 	3 
440	20	0	1	12	2011	2 	4 
441	21	5	0	0	2011	2 	1 
442	21	6	2	0	2011	2 	2 
443	21	0	0	6	2011	2 	3 
444	21	0	0	4	2011	2 	4 
445	28	3	0	0	2011	2 	1 
446	28	3	0	2	2011	2 	2 
447	28	1	0	3	2011	2 	3 
448	28	1	0	3	2011	2 	4 
449	29	0	0	0	2011	2 	1 
450	29	4	0	0	2011	2 	2 
451	29	3	0	3	2011	2 	3 
452	29	1	0	3	2011	2 	4 
453	30	1	0	0	2011	2 	1 
454	30	2	0	1	2011	2 	2 
455	30	1	1	1	2011	2 	3 
456	30	1	2	4	2011	2 	4 
457	22	2	0	0	2011	2 	1 
458	22	5	0	5	2011	2 	2 
459	22	2	1	14	2011	2 	3 
460	22	0	0	4	2011	2 	4 
461	23	5	0	1	2011	2 	1 
462	23	8	2	9	2011	2 	2 
463	23	1	0	2	2011	2 	3 
464	23	0	0	1	2011	2 	4 
465	24	1	0	0	2011	2 	1 
466	24	3	0	2	2011	2 	2 
467	24	6	0	12	2011	2 	3 
468	24	1	0	3	2011	2 	4 
469	25	1	0	0	2011	2 	1 
470	25	4	0	1	2011	2 	2 
471	25	4	3	10	2011	2 	3 
472	25	0	1	4	2011	2 	4 
473	26	0	0	0	2011	2 	1 
474	26	7	0	0	2011	2 	2 
475	26	0	1	5	2011	2 	3 
476	26	0	1	3	2011	2 	4 
477	27	2	0	0	2011	2 	1 
478	27	4	0	2	2011	2 	2 
479	27	0	0	2	2011	2 	3 
480	27	1	0	6	2011	2 	4 
481	4 	0	0	0	2012	1 	1 
482	4 	4	0	0	2012	1 	2 
483	4 	1	1	4	2012	1 	3 
484	4 	1	1	6	2012	1 	4 
485	1 	2	0	0	2012	1 	1 
486	1 	5	0	2	2012	1 	2 
487	1 	4	1	7	2012	1 	3 
488	1 	1	0	2	2012	1 	4 
489	2 	1	0	0	2012	1 	1 
490	2 	3	0	2	2012	1 	2 
491	2 	4	1	15	2012	1 	3 
492	2 	1	1	3	2012	1 	4 
493	3 	0	0	0	2012	1 	1 
494	3 	3	0	2	2012	1 	2 
495	3 	2	1	4	2012	1 	3 
496	3 	3	4	22	2012	1 	4 
497	5 	3	0	0	2012	1 	1 
498	5 	7	1	5	2012	1 	2 
499	5 	0	0	2	2012	1 	3 
500	5 	0	1	4	2012	1 	4 
501	6 	3	0	0	2012	1 	1 
502	6 	7	1	1	2012	1 	2 
503	6 	0	0	1	2012	1 	3 
504	6 	0	1	4	2012	1 	4 
505	16	0	0	0	2012	1 	1 
506	16	5	1	1	2012	1 	2 
507	16	0	0	5	2012	1 	3 
508	16	0	0	2	2012	1 	4 
509	17	0	0	0	2012	1 	1 
510	17	1	0	4	2012	1 	2 
511	17	1	0	38	2012	1 	3 
512	17	0	1	6	2012	1 	4 
513	7 	0	0	0	2012	1 	1 
514	7 	5	0	1	2012	1 	2 
515	7 	2	2	5	2012	1 	3 
516	7 	2	3	4	2012	1 	4 
517	8 	1	0	0	2012	1 	1 
518	8 	2	0	2	2012	1 	2 
519	8 	2	3	18	2012	1 	3 
520	8 	0	0	4	2012	1 	4 
521	9 	1	0	0	2012	1 	1 
522	9 	2	0	1	2012	1 	2 
523	9 	1	1	9	2012	1 	3 
524	9 	0	0	3	2012	1 	4 
525	10	2	0	0	2012	1 	1 
526	10	3	0	3	2012	1 	2 
527	10	0	0	1	2012	1 	3 
528	10	0	0	4	2012	1 	4 
529	11	1	0	1	2012	1 	1 
530	11	9	1	3	2012	1 	2 
531	11	0	0	1	2012	1 	3 
532	11	0	0	5	2012	1 	4 
533	12	1	0	0	2012	1 	1 
534	12	2	0	0	2012	1 	2 
535	12	2	1	1	2012	1 	3 
536	12	0	1	1	2012	1 	4 
537	13	5	0	0	2012	1 	1 
538	13	8	2	4	2012	1 	2 
539	13	2	0	25	2012	1 	3 
540	13	0	1	36	2012	1 	4 
541	14	2	0	0	2012	1 	1 
542	14	5	1	7	2012	1 	2 
543	14	0	2	5	2012	1 	3 
544	14	0	1	6	2012	1 	4 
545	15	1	0	0	2012	1 	1 
546	15	5	0	0	2012	1 	2 
547	15	1	0	2	2012	1 	3 
548	15	0	1	0	2012	1 	4 
549	18	4	0	1	2012	1 	1 
550	18	6	3	3	2012	1 	2 
551	18	2	0	1	2012	1 	3 
552	18	0	1	7	2012	1 	4 
553	19	5	0	0	2012	1 	1 
554	19	4	0	6	2012	1 	2 
555	19	1	0	2	2012	1 	3 
556	19	0	1	5	2012	1 	4 
557	20	1	0	0	2012	1 	1 
558	20	20	0	8	2012	1 	2 
559	20	4	1	14	2012	1 	3 
560	20	0	1	11	2012	1 	4 
561	21	6	0	0	2012	1 	1 
562	21	5	2	2	2012	1 	2 
563	21	0	0	9	2012	1 	3 
564	21	0	0	5	2012	1 	4 
565	28	3	0	0	2012	1 	1 
566	28	3	1	1	2012	1 	2 
567	28	1	0	4	2012	1 	3 
568	28	1	0	4	2012	1 	4 
569	29	0	0	0	2012	1 	1 
570	29	4	0	3	2012	1 	2 
571	29	3	0	8	2012	1 	3 
572	29	1	0	7	2012	1 	4 
573	30	1	0	0	2012	1 	1 
574	30	2	0	1	2012	1 	2 
575	30	1	0	0	2012	1 	3 
576	30	1	1	5	2012	1 	4 
577	22	2	0	0	2012	1 	1 
578	22	4	0	4	2012	1 	2 
579	22	3	0	14	2012	1 	3 
580	22	0	0	4	2012	1 	4 
581	23	5	0	0	2012	1 	1 
582	23	9	3	10	2012	1 	2 
583	23	1	0	2	2012	1 	3 
584	23	0	0	2	2012	1 	4 
585	24	1	0	0	2012	1 	1 
586	24	3	0	3	2012	1 	2 
587	24	6	1	5	2012	1 	3 
588	24	1	0	6	2012	1 	4 
589	25	1	0	0	2012	1 	1 
590	25	7	1	1	2012	1 	2 
591	25	1	3	11	2012	1 	3 
592	25	0	0	11	2012	1 	4 
593	26	0	0	0	2012	1 	1 
594	26	8	0	1	2012	1 	2 
595	26	0	0	5	2012	1 	3 
596	26	0	2	6	2012	1 	4 
597	27	2	0	0	2012	1 	1 
598	27	4	1	1	2012	1 	2 
599	27	1	0	4	2012	1 	3 
600	27	0	1	5	2012	1 	4 
601	4 	0	0	0	2012	2 	1 
602	4 	4	0	1	2012	2 	2 
603	4 	1	0	6	2012	2 	3 
604	4 	1	2	1	2012	2 	4 
605	1 	3	0	0	2012	2 	1 
606	1 	4	1	1	2012	2 	2 
607	1 	4	0	9	2012	2 	3 
608	1 	1	0	3	2012	2 	4 
609	2 	1	0	0	2012	2 	1 
610	2 	3	0	1	2012	2 	2 
611	2 	4	0	17	2012	2 	3 
612	2 	1	0	4	2012	2 	4 
613	3 	0	0	0	2012	2 	1 
614	3 	3	1	1	2012	2 	2 
615	3 	2	2	3	2012	2 	3 
616	3 	3	3	31	2012	2 	4 
617	5 	3	0	0	2012	2 	1 
618	5 	7	1	4	2012	2 	2 
619	5 	0	0	4	2012	2 	3 
620	5 	0	1	4	2012	2 	4 
621	6 	4	0	0	2012	2 	1 
622	6 	6	1	2	2012	2 	2 
623	6 	0	0	0	2012	2 	3 
624	6 	0	2	5	2012	2 	4 
625	16	0	0	0	2012	2 	1 
626	16	5	1	1	2012	2 	2 
627	16	0	0	2	2012	2 	3 
628	16	0	0	0	2012	2 	4 
629	17	0	0	0	2012	2 	1 
630	17	1	0	4	2012	2 	2 
631	17	1	0	31	2012	2 	3 
632	17	0	0	9	2012	2 	4 
633	7 	0	0	0	2012	2 	1 
634	7 	5	0	2	2012	2 	2 
635	7 	2	3	5	2012	2 	3 
636	7 	2	2	2	2012	2 	4 
637	8 	1	0	0	2012	2 	1 
638	8 	2	0	2	2012	2 	2 
639	8 	2	4	19	2012	2 	3 
640	8 	0	0	2	2012	2 	4 
641	9 	1	0	0	2012	2 	1 
642	9 	2	0	2	2012	2 	2 
643	9 	1	1	8	2012	2 	3 
644	9 	0	0	0	2012	2 	4 
645	10	2	0	0	2012	2 	1 
646	10	3	0	6	2012	2 	2 
647	10	0	0	4	2012	2 	3 
648	10	0	1	3	2012	2 	4 
649	11	1	0	3	2012	2 	1 
650	11	9	0	5	2012	2 	2 
651	11	0	0	2	2012	2 	3 
652	11	0	0	2	2012	2 	4 
653	12	1	0	0	2012	2 	1 
654	12	2	0	0	2012	2 	2 
655	12	2	1	1	2012	2 	3 
656	12	0	1	1	2012	2 	4 
657	13	5	0	0	2012	2 	1 
658	13	9	3	5	2012	2 	2 
659	13	1	0	24	2012	2 	3 
660	13	0	0	26	2012	2 	4 
661	14	2	0	0	2012	2 	1 
662	14	5	0	6	2012	2 	2 
663	14	0	1	7	2012	2 	3 
664	14	0	1	8	2012	2 	4 
665	15	1	0	0	2012	2 	1 
666	15	6	0	0	2012	2 	2 
667	15	0	0	2	2012	2 	3 
668	15	0	0	1	2012	2 	4 
669	18	5	0	1	2012	2 	1 
670	18	5	2	3	2012	2 	2 
671	18	2	0	1	2012	2 	3 
672	18	0	1	3	2012	2 	4 
673	19	5	0	0	2012	2 	1 
674	19	4	0	6	2012	2 	2 
675	19	1	0	3	2012	2 	3 
676	19	0	0	5	2012	2 	4 
677	20	1	0	0	2012	2 	1 
678	20	21	0	5	2012	2 	2 
679	20	3	1	11	2012	2 	3 
680	20	0	0	16	2012	2 	4 
681	21	6	0	0	2012	2 	1 
682	21	5	0	2	2012	2 	2 
683	21	0	0	4	2012	2 	3 
684	21	0	0	7	2012	2 	4 
685	28	3	0	0	2012	2 	1 
686	28	3	1	1	2012	2 	2 
687	28	1	0	3	2012	2 	3 
688	28	1	1	2	2012	2 	4 
689	29	0	0	0	2012	2 	1 
690	29	4	0	0	2012	2 	2 
691	29	3	0	8	2012	2 	3 
692	29	1	2	2	2012	2 	4 
693	30	1	0	0	2012	2 	1 
694	30	2	1	0	2012	2 	2 
695	30	1	0	2	2012	2 	3 
696	30	1	3	3	2012	2 	4 
697	22	2	0	0	2012	2 	1 
698	22	5	0	4	2012	2 	2 
699	22	2	0	13	2012	2 	3 
700	22	0	1	6	2012	2 	4 
701	23	5	0	0	2012	2 	1 
702	23	9	2	9	2012	2 	2 
703	23	1	0	3	2012	2 	3 
704	23	0	0	2	2012	2 	4 
705	24	1	0	0	2012	2 	1 
706	24	3	0	2	2012	2 	2 
707	24	6	0	11	2012	2 	3 
708	24	1	1	3	2012	2 	4 
709	25	1	0	0	2012	2 	1 
710	25	8	1	3	2012	2 	2 
711	25	0	2	17	2012	2 	3 
712	25	0	1	1	2012	2 	4 
713	26	2	0	0	2012	2 	1 
714	26	6	0	0	2012	2 	2 
715	26	0	1	3	2012	2 	3 
716	26	0	1	4	2012	2 	4 
717	27	2	0	1	2012	2 	1 
718	27	5	2	1	2012	2 	2 
719	27	0	0	4	2012	2 	3 
720	27	0	1	4	2012	2 	4 
721	4 	0	0	0	2013	1 	1 
722	4 	4	0	3	2013	1 	2 
723	4 	1	1	6	2013	1 	3 
724	4 	1	1	4	2013	1 	4 
725	1 	3	0	0	2013	1 	1 
726	1 	4	1	3	2013	1 	2 
727	1 	4	0	9	2013	1 	3 
728	1 	1	0	1	2013	1 	4 
729	2 	1	0	0	2013	1 	1 
730	2 	4	0	1	2013	1 	2 
731	2 	3	2	14	2013	1 	3 
732	2 	1	1	5	2013	1 	4 
733	3 	0	0	0	2013	1 	1 
734	3 	5	1	3	2013	1 	2 
735	3 	2	2	4	2013	1 	3 
736	3 	1	2	23	2013	1 	4 
737	5 	3	0	0	2013	1 	1 
738	5 	7	1	8	2013	1 	2 
739	5 	0	1	2	2013	1 	3 
740	5 	0	0	1	2013	1 	4 
741	6 	4	0	0	2013	1 	1 
742	6 	6	3	3	2013	1 	2 
743	6 	0	0	1	2013	1 	3 
744	6 	0	2	4	2013	1 	4 
745	16	0	0	0	2013	1 	1 
746	16	5	0	2	2013	1 	2 
747	16	0	1	2	2013	1 	3 
748	16	0	0	4	2013	1 	4 
749	17	0	0	0	2013	1 	1 
750	17	1	0	2	2013	1 	2 
751	17	1	0	41	2013	1 	3 
752	17	0	1	7	2013	1 	4 
753	7 	0	0	0	2013	1 	1 
754	7 	5	1	3	2013	1 	2 
755	7 	2	4	5	2013	1 	3 
756	7 	2	1	1	2013	1 	4 
757	8 	1	0	0	2013	1 	1 
758	8 	2	0	3	2013	1 	2 
759	8 	2	2	13	2013	1 	3 
760	8 	0	0	3	2013	1 	4 
761	9 	1	0	0	2013	1 	1 
762	9 	2	0	2	2013	1 	2 
763	9 	1	1	7	2013	1 	3 
764	9 	0	0	1	2013	1 	4 
765	10	2	0	0	2013	1 	1 
766	10	3	0	6	2013	1 	2 
767	10	0	0	4	2013	1 	3 
768	10	0	2	0	2013	1 	4 
769	11	1	0	0	2013	1 	1 
770	11	9	1	3	2013	1 	2 
771	11	0	0	0	2013	1 	3 
772	11	0	0	3	2013	1 	4 
773	12	1	0	0	2013	1 	1 
774	12	2	0	0	2013	1 	2 
775	12	2	2	1	2013	1 	3 
776	12	0	0	1	2013	1 	4 
777	13	5	0	0	2013	1 	1 
778	13	9	4	9	2013	1 	2 
779	13	1	1	22	2013	1 	3 
780	13	0	1	40	2013	1 	4 
781	14	2	0	0	2013	1 	1 
782	14	5	0	9	2013	1 	2 
783	14	0	1	4	2013	1 	3 
784	14	0	1	6	2013	1 	4 
785	15	1	0	0	2013	1 	1 
786	15	6	0	1	2013	1 	2 
787	15	0	0	2	2013	1 	3 
788	15	0	1	0	2013	1 	4 
789	18	5	0	1	2013	1 	1 
790	18	5	3	3	2013	1 	2 
791	18	2	0	1	2013	1 	3 
792	18	0	0	7	2013	1 	4 
793	19	5	0	0	2013	1 	1 
794	19	4	0	5	2013	1 	2 
795	19	1	0	3	2013	1 	3 
796	19	0	0	6	2013	1 	4 
797	20	2	0	0	2013	1 	1 
798	20	20	1	9	2013	1 	2 
799	20	3	0	20	2013	1 	3 
800	20	0	0	6	2013	1 	4 
801	21	6	1	0	2013	1 	1 
802	21	5	1	5	2013	1 	2 
803	21	0	0	5	2013	1 	3 
804	21	0	0	7	2013	1 	4 
805	28	3	0	0	2013	1 	1 
806	28	4	1	2	2013	1 	2 
807	28	1	0	6	2013	1 	3 
808	28	0	1	0	2013	1 	4 
809	29	0	0	0	2013	1 	1 
810	29	4	0	1	2013	1 	2 
811	29	3	0	6	2013	1 	3 
812	29	1	2	5	2013	1 	4 
813	30	1	0	0	2013	1 	1 
814	30	2	0	0	2013	1 	2 
815	30	1	0	1	2013	1 	3 
816	30	1	3	2	2013	1 	4 
817	22	2	0	0	2013	1 	1 
818	22	5	0	3	2013	1 	2 
819	22	2	0	11	2013	1 	3 
820	22	0	0	6	2013	1 	4 
821	23	5	0	1	2013	1 	1 
822	23	8	2	11	2013	1 	2 
823	23	1	0	1	2013	1 	3 
824	23	0	0	0	2013	1 	4 
825	24	1	0	0	2013	1 	1 
826	24	4	0	1	2013	1 	2 
827	24	5	1	7	2013	1 	3 
828	24	1	0	3	2013	1 	4 
829	25	1	0	0	2013	1 	1 
830	25	8	0	8	2013	1 	2 
831	25	0	3	13	2013	1 	3 
832	25	0	1	1	2013	1 	4 
833	26	2	0	0	2013	1 	1 
834	26	6	0	0	2013	1 	2 
835	26	0	1	2	2013	1 	3 
836	26	0	1	4	2013	1 	4 
837	27	2	0	1	2013	1 	1 
838	27	5	0	1	2013	1 	2 
839	27	0	1	2	2013	1 	3 
840	27	0	1	5	2013	1 	4 
841	4 	0	0	0	2013	2 	1 
842	4 	4	0	2	2013	2 	2 
843	4 	1	2	4	2013	2 	3 
844	4 	1	0	5	2013	2 	4 
845	1 	3	0	0	2013	2 	1 
846	1 	4	0	4	2013	2 	2 
847	1 	4	0	8	2013	2 	3 
848	1 	1	0	4	2013	2 	4 
849	2 	2	0	0	2013	2 	1 
850	2 	4	0	1	2013	2 	2 
851	2 	3	3	11	2013	2 	3 
852	2 	1	1	8	2013	2 	4 
853	3 	0	0	0	2013	2 	1 
854	3 	5	0	4	2013	2 	2 
855	3 	1	1	5	2013	2 	3 
856	3 	1	2	26	2013	2 	4 
857	5 	4	0	0	2013	2 	1 
858	5 	7	1	8	2013	2 	2 
859	5 	0	1	2	2013	2 	3 
860	5 	0	0	0	2013	2 	4 
861	6 	4	0	0	2013	2 	1 
862	6 	7	1	5	2013	2 	2 
863	6 	0	1	1	2013	2 	3 
864	6 	0	2	3	2013	2 	4 
865	16	0	0	0	2013	2 	1 
866	16	5	0	1	2013	2 	2 
867	16	0	2	2	2013	2 	3 
868	16	0	0	2	2013	2 	4 
869	17	0	0	0	2013	2 	1 
870	17	1	0	2	2013	2 	2 
871	17	1	0	32	2013	2 	3 
872	17	0	1	11	2013	2 	4 
873	7 	0	0	0	2013	2 	1 
874	7 	5	0	3	2013	2 	2 
875	7 	2	4	3	2013	2 	3 
876	7 	2	1	0	2013	2 	4 
877	8 	1	0	0	2013	2 	1 
878	8 	2	0	3	2013	2 	2 
879	8 	2	3	12	2013	2 	3 
880	8 	0	0	3	2013	2 	4 
881	9 	1	0	0	2013	2 	1 
882	9 	2	0	2	2013	2 	2 
883	9 	1	1	6	2013	2 	3 
884	9 	0	0	1	2013	2 	4 
885	10	2	0	0	2013	2 	1 
886	10	3	0	6	2013	2 	2 
887	10	0	0	4	2013	2 	3 
888	10	0	1	1	2013	2 	4 
889	11	1	0	0	2013	2 	1 
890	11	10	1	3	2013	2 	2 
891	11	0	0	0	2013	2 	3 
892	11	0	0	2	2013	2 	4 
893	12	1	0	0	2013	2 	1 
894	12	3	0	0	2013	2 	2 
895	12	1	2	0	2013	2 	3 
896	12	0	0	1	2013	2 	4 
897	13	5	0	0	2013	2 	1 
898	13	9	4	8	2013	2 	2 
899	13	1	0	20	2013	2 	3 
900	13	0	0	38	2013	2 	4 
901	14	2	0	0	2013	2 	1 
902	14	5	0	10	2013	2 	2 
903	14	0	1	3	2013	2 	3 
904	14	0	2	6	2013	2 	4 
905	15	1	0	0	2013	2 	1 
906	15	6	0	0	2013	2 	2 
907	15	0	0	3	2013	2 	3 
908	15	0	0	1	2013	2 	4 
909	18	5	0	1	2013	2 	1 
910	18	5	4	4	2013	2 	2 
911	18	2	0	1	2013	2 	3 
912	18	0	0	5	2013	2 	4 
913	19	5	0	0	2013	2 	1 
914	19	4	2	3	2013	2 	2 
915	19	1	0	4	2013	2 	3 
916	19	0	1	7	2013	2 	4 
917	20	4	0	0	2013	2 	1 
918	20	19	0	7	2013	2 	2 
919	20	3	0	15	2013	2 	3 
920	20	0	2	7	2013	2 	4 
921	21	6	0	0	2013	2 	1 
922	21	4	2	1	2013	2 	2 
923	21	0	0	4	2013	2 	3 
924	21	0	0	3	2013	2 	4 
925	28	3	0	0	2013	2 	1 
926	28	4	0	3	2013	2 	2 
927	28	1	0	4	2013	2 	3 
928	28	0	0	1	2013	2 	4 
929	29	0	0	0	2013	2 	1 
930	29	4	0	1	2013	2 	2 
931	29	3	0	10	2013	2 	3 
932	29	1	2	5	2013	2 	4 
933	30	2	0	0	2013	2 	1 
934	30	2	0	0	2013	2 	2 
935	30	0	0	2	2013	2 	3 
936	30	1	2	3	2013	2 	4 
937	22	2	0	0	2013	2 	1 
938	22	5	0	5	2013	2 	2 
939	22	2	0	16	2013	2 	3 
940	22	0	0	7	2013	2 	4 
941	23	5	0	1	2013	2 	1 
942	23	9	1	9	2013	2 	2 
943	23	1	0	1	2013	2 	3 
944	23	0	0	2	2013	2 	4 
945	24	1	0	0	2013	2 	1 
946	24	4	0	1	2013	2 	2 
947	24	5	0	7	2013	2 	3 
948	24	1	0	7	2013	2 	4 
949	25	1	0	0	2013	2 	1 
950	25	9	0	9	2013	2 	2 
951	25	0	4	11	2013	2 	3 
952	25	0	0	2	2013	2 	4 
953	26	2	0	0	2013	2 	1 
954	26	5	0	2	2013	2 	2 
955	26	0	1	3	2013	2 	3 
956	26	0	2	4	2013	2 	4 
957	27	3	0	0	2013	2 	1 
958	27	4	1	0	2013	2 	2 
959	27	0	1	2	2013	2 	3 
960	27	0	1	6	2013	2 	4 
961	4 	0	0	0	2014	1 	1 
962	4 	4	0	1	2014	1 	2 
963	4 	1	1	5	2014	1 	3 
964	4 	1	0	4	2014	1 	4 
965	1 	3	0	0	2014	1 	1 
966	1 	4	1	4	2014	1 	2 
967	1 	4	1	6	2014	1 	3 
968	1 	1	0	3	2014	1 	4 
969	2 	2	0	0	2014	1 	1 
970	2 	4	0	1	2014	1 	2 
971	2 	3	3	9	2014	1 	3 
972	2 	1	1	14	2014	1 	4 
973	3 	0	0	0	2014	1 	1 
974	3 	5	1	5	2014	1 	2 
975	3 	1	1	5	2014	1 	3 
976	3 	1	1	24	2014	1 	4 
977	5 	4	0	0	2014	1 	1 
978	5 	7	0	9	2014	1 	2 
979	5 	0	0	3	2014	1 	3 
980	5 	0	0	1	2014	1 	4 
981	6 	4	0	0	2014	1 	1 
982	6 	6	1	6	2014	1 	2 
983	6 	0	1	0	2014	1 	3 
984	6 	0	0	11	2014	1 	4 
985	16	0	0	0	2014	1 	1 
986	16	5	0	1	2014	1 	2 
987	16	0	1	2	2014	1 	3 
988	16	0	0	3	2014	1 	4 
989	17	0	0	0	2014	1 	1 
990	17	1	0	3	2014	1 	2 
991	17	1	0	41	2014	1 	3 
992	17	0	2	14	2014	1 	4 
993	7 	0	0	0	2014	1 	1 
994	7 	6	1	2	2014	1 	2 
995	7 	1	3	4	2014	1 	3 
996	7 	2	0	1	2014	1 	4 
997	8 	1	0	0	2014	1 	1 
998	8 	2	0	4	2014	1 	2 
999	8 	2	3	11	2014	1 	3 
1000	8 	0	0	2	2014	1 	4 
1001	9 	1	0	0	2014	1 	1 
1002	9 	2	0	2	2014	1 	2 
1003	9 	1	1	8	2014	1 	3 
1004	9 	0	0	0	2014	1 	4 
1005	10	2	0	0	2014	1 	1 
1006	10	3	0	5	2014	1 	2 
1007	10	0	0	4	2014	1 	3 
1008	10	0	1	2	2014	1 	4 
1009	11	2	0	0	2014	1 	1 
1010	11	9	0	5	2014	1 	2 
1011	11	0	0	0	2014	1 	3 
1012	11	0	0	2	2014	1 	4 
1013	12	1	0	0	2014	1 	1 
1014	12	3	1	0	2014	1 	2 
1015	12	1	1	0	2014	1 	3 
1016	12	0	0	1	2014	1 	4 
1017	13	4	0	0	2014	1 	1 
1018	13	9	1	9	2014	1 	2 
1019	13	1	2	19	2014	1 	3 
1020	13	0	2	52	2014	1 	4 
1021	14	2	0	0	2014	1 	1 
1022	14	5	0	10	2014	1 	2 
1023	14	0	1	3	2014	1 	3 
1024	14	0	3	3	2014	1 	4 
1025	15	1	0	0	2014	1 	1 
1026	15	6	0	0	2014	1 	2 
1027	15	0	0	3	2014	1 	3 
1028	15	0	0	1	2014	1 	4 
1029	18	5	0	1	2014	1 	1 
1030	18	5	1	4	2014	1 	2 
1031	18	2	0	2	2014	1 	3 
1032	18	0	0	8	2014	1 	4 
1033	19	5	0	0	2014	1 	1 
1034	19	4	0	5	2014	1 	2 
1035	19	1	0	4	2014	1 	3 
1036	19	0	0	8	2014	1 	4 
1037	20	4	0	1	2014	1 	1 
1038	20	19	0	8	2014	1 	2 
1039	20	3	0	18	2014	1 	3 
1040	20	0	2	11	2014	1 	4 
1041	21	8	0	0	2014	1 	1 
1042	21	2	1	3	2014	1 	2 
1043	21	0	0	6	2014	1 	3 
1044	21	0	0	5	2014	1 	4 
1045	28	3	0	0	2014	1 	1 
1046	28	4	1	2	2014	1 	2 
1047	28	1	1	3	2014	1 	3 
1048	28	0	0	0	2014	1 	4 
1049	29	0	0	0	2014	1 	1 
1050	29	4	0	0	2014	1 	2 
1051	29	3	0	6	2014	1 	3 
1052	29	1	2	3	2014	1 	4 
1053	30	2	0	0	2014	1 	1 
1054	30	2	1	2	2014	1 	2 
1055	30	0	0	1	2014	1 	3 
1056	30	1	0	3	2014	1 	4 
1057	22	2	0	0	2014	1 	1 
1058	22	5	0	5	2014	1 	2 
1059	22	2	0	16	2014	1 	3 
1060	22	0	0	7	2014	1 	4 
1061	23	6	0	1	2014	1 	1 
1062	23	8	1	10	2014	1 	2 
1063	23	1	0	1	2014	1 	3 
1064	23	0	0	2	2014	1 	4 
1065	24	1	0	0	2014	1 	1 
1066	24	4	0	1	2014	1 	2 
1067	24	5	1	5	2014	1 	3 
1068	24	1	0	7	2014	1 	4 
1069	25	2	0	0	2014	1 	1 
1070	25	8	0	8	2014	1 	2 
1071	25	0	4	14	2014	1 	3 
1072	25	0	0	4	2014	1 	4 
1073	26	2	0	0	2014	1 	1 
1074	26	5	0	1	2014	1 	2 
1075	26	0	1	3	2014	1 	3 
1076	26	0	2	7	2014	1 	4 
1077	27	3	0	0	2014	1 	1 
1078	27	4	1	0	2014	1 	2 
1079	27	0	0	2	2014	1 	3 
1080	27	0	1	7	2014	1 	4 
1081	4 	0	0	0	2014	2 	1 
1082	4 	4	0	2	2014	2 	2 
1083	4 	1	1	6	2014	2 	3 
1084	4 	1	1	4	2014	2 	4 
1085	1 	3	0	0	2014	2 	1 
1086	1 	4	1	4	2014	2 	2 
1087	1 	2	1	5	2014	2 	3 
1088	1 	1	0	2	2014	2 	4 
1089	2 	2	0	0	2014	2 	1 
1090	2 	5	0	1	2014	2 	2 
1091	2 	3	0	13	2014	2 	3 
1092	2 	0	0	9	2014	2 	4 
1093	3 	0	0	0	2014	2 	1 
1094	3 	5	1	5	2014	2 	2 
1095	3 	1	1	6	2014	2 	3 
1096	3 	1	3	23	2014	2 	4 
1097	5 	4	0	0	2014	2 	1 
1098	5 	7	1	7	2014	2 	2 
1099	5 	0	1	2	2014	2 	3 
1100	5 	0	0	2	2014	2 	4 
1101	6 	4	0	0	2014	2 	1 
1102	6 	6	1	10	2014	2 	2 
1103	6 	0	1	3	2014	2 	3 
1104	6 	1	2	9	2014	2 	4 
1105	16	0	0	0	2014	2 	1 
1106	16	5	0	2	2014	2 	2 
1107	16	0	0	3	2014	2 	3 
1108	16	0	0	4	2014	2 	4 
1109	17	0	0	0	2014	2 	1 
1110	17	1	0	5	2014	2 	2 
1111	17	1	0	28	2014	2 	3 
1112	17	0	1	13	2014	2 	4 
1113	7 	0	0	0	2014	2 	1 
1114	7 	7	1	2	2014	2 	2 
1115	7 	0	0	7	2014	2 	3 
1116	7 	2	0	0	2014	2 	4 
1117	8 	1	0	0	2014	2 	1 
1118	8 	2	0	4	2014	2 	2 
1119	8 	2	2	11	2014	2 	3 
1120	8 	0	0	0	2014	2 	4 
1121	9 	1	0	0	2014	2 	1 
1122	9 	1	0	1	2014	2 	2 
1123	9 	1	2	7	2014	2 	3 
1124	9 	0	0	0	2014	2 	4 
1125	10	2	0	0	2014	2 	1 
1126	10	3	0	4	2014	2 	2 
1127	10	0	1	2	2014	2 	3 
1128	10	0	0	2	2014	2 	4 
1129	11	6	0	0	2014	2 	1 
1130	11	18	2	8	2014	2 	2 
1131	11	1	0	5	2014	2 	3 
1132	11	0	1	7	2014	2 	4 
1133	12	1	0	0	2014	2 	1 
1134	12	3	0	1	2014	2 	2 
1135	12	1	0	1	2014	2 	3 
1136	12	0	0	0	2014	2 	4 
1137	13	0	0	0	2014	2 	1 
1138	13	0	0	5	2014	2 	2 
1139	13	0	0	14	2014	2 	3 
1140	13	0	0	41	2014	2 	4 
1141	14	2	0	0	2014	2 	1 
1142	14	6	0	8	2014	2 	2 
1143	14	0	0	3	2014	2 	3 
1144	14	0	0	5	2014	2 	4 
1145	15	2	0	0	2014	2 	1 
1146	15	5	0	0	2014	2 	2 
1147	15	0	0	3	2014	2 	3 
1148	15	0	0	1	2014	2 	4 
1149	18	6	0	1	2014	2 	1 
1150	18	5	0	5	2014	2 	2 
1151	18	2	0	1	2014	2 	3 
1152	18	0	0	3	2014	2 	4 
1153	19	5	0	0	2014	2 	1 
1154	19	5	0	5	2014	2 	2 
1155	19	1	0	4	2014	2 	3 
1156	19	0	0	2	2014	2 	4 
1157	20	5	1	0	2014	2 	1 
1158	20	19	0	5	2014	2 	2 
1159	20	2	0	15	2014	2 	3 
1160	20	0	1	5	2014	2 	4 
1161	21	8	0	1	2014	2 	1 
1162	21	2	0	4	2014	2 	2 
1163	21	0	0	5	2014	2 	3 
1164	21	0	0	2	2014	2 	4 
1165	28	3	0	0	2014	2 	1 
1166	28	4	0	3	2014	2 	2 
1167	28	1	0	4	2014	2 	3 
1168	28	0	0	1	2014	2 	4 
1169	29	0	0	0	2014	2 	1 
1170	29	5	0	1	2014	2 	2 
1171	29	1	0	6	2014	2 	3 
1172	29	1	0	8	2014	2 	4 
1173	30	2	0	0	2014	2 	1 
1174	30	2	0	3	2014	2 	2 
1175	30	0	0	2	2014	2 	3 
1176	30	2	1	3	2014	2 	4 
1177	22	3	0	0	2014	2 	1 
1178	22	5	0	5	2014	2 	2 
1179	22	2	0	17	2014	2 	3 
1180	22	0	0	6	2014	2 	4 
1181	23	6	0	1	2014	2 	1 
1182	23	8	1	8	2014	2 	2 
1183	23	1	0	1	2014	2 	3 
1184	23	0	0	3	2014	2 	4 
1185	24	1	0	0	2014	2 	1 
1186	24	4	0	1	2014	2 	2 
1187	24	5	1	4	2014	2 	3 
1188	24	1	0	4	2014	2 	4 
1189	25	2	0	0	2014	2 	1 
1190	25	8	1	7	2014	2 	2 
1191	25	0	1	15	2014	2 	3 
1192	25	0	0	3	2014	2 	4 
1193	26	2	0	0	2014	2 	1 
1194	26	5	0	4	2014	2 	2 
1195	26	0	1	2	2014	2 	3 
1196	26	0	1	3	2014	2 	4 
1197	27	3	0	0	2014	2 	1 
1198	27	4	0	1	2014	2 	2 
1199	27	0	0	2	2014	2 	3 
1200	27	0	0	7	2014	2 	4 
1201	4 	0	0	0	2015	1 	1 
1202	4 	4	0	2	2015	1 	2 
1203	4 	1	2	5	2015	1 	3 
1204	4 	1	2	4	2015	1 	4 
1205	1 	4	0	0	2015	1 	1 
1206	1 	3	3	2	2015	1 	2 
1207	1 	2	0	10	2015	1 	3 
1208	1 	1	0	1	2015	1 	4 
1209	2 	2	0	0	2015	1 	1 
1210	2 	5	0	2	2015	1 	2 
1211	2 	3	0	15	2015	1 	3 
1212	2 	0	2	6	2015	1 	4 
1213	3 	0	0	0	2015	1 	1 
1214	3 	6	1	8	2015	1 	2 
1215	3 	1	0	6	2015	1 	3 
1216	3 	0	2	24	2015	1 	4 
1217	5 	6	0	0	2015	1 	1 
1218	5 	5	0	7	2015	1 	2 
1219	5 	0	1	1	2015	1 	3 
1220	5 	0	0	0	2015	1 	4 
1221	6 	5	0	0	2015	1 	1 
1222	6 	5	4	6	2015	1 	2 
1223	6 	0	0	4	2015	1 	3 
1224	6 	1	0	11	2015	1 	4 
1225	16	0	0	0	2015	1 	1 
1226	16	5	0	5	2015	1 	2 
1227	16	0	0	5	2015	1 	3 
1228	16	0	0	1	2015	1 	4 
1229	17	0	0	0	2015	1 	1 
1230	17	1	0	4	2015	1 	2 
1231	17	1	1	41	2015	1 	3 
1232	17	0	0	12	2015	1 	4 
1233	7 	0	0	0	2015	1 	1 
1234	7 	7	0	3	2015	1 	2 
1235	7 	0	0	8	2015	1 	3 
1236	7 	2	0	0	2015	1 	4 
1237	8 	1	0	0	2015	1 	1 
1238	8 	2	0	4	2015	1 	2 
1239	8 	2	1	16	2015	1 	3 
1240	8 	0	0	2	2015	1 	4 
1241	9 	1	0	0	2015	1 	1 
1242	9 	1	0	1	2015	1 	2 
1243	9 	1	2	7	2015	1 	3 
1244	9 	0	0	0	2015	1 	4 
1245	10	2	0	1	2015	1 	1 
1246	10	3	0	6	2015	1 	2 
1247	10	0	0	1	2015	1 	3 
1248	10	0	1	3	2015	1 	4 
1249	11	2	0	0	2015	1 	1 
1250	11	9	0	4	2015	1 	2 
1251	11	0	0	2	2015	1 	3 
1252	11	0	0	0	2015	1 	4 
1253	12	1	0	1	2015	1 	1 
1254	12	2	0	1	2015	1 	2 
1255	12	1	0	2	2015	1 	3 
1256	12	0	0	1	2015	1 	4 
1257	13	4	0	0	2015	1 	1 
1258	13	9	2	7	2015	1 	2 
1259	13	1	1	18	2015	1 	3 
1260	13	0	0	46	2015	1 	4 
1261	14	2	0	0	2015	1 	1 
1262	14	6	1	11	2015	1 	2 
1263	14	0	0	3	2015	1 	3 
1264	14	0	0	4	2015	1 	4 
1265	15	2	0	0	2015	1 	1 
1266	15	4	1	3	2015	1 	2 
1267	15	0	0	4	2015	1 	3 
1268	15	0	1	0	2015	1 	4 
1269	18	6	0	2	2015	1 	1 
1270	18	5	1	3	2015	1 	2 
1271	18	2	0	1	2015	1 	3 
1272	18	0	0	7	2015	1 	4 
1273	19	5	0	0	2015	1 	1 
1274	19	5	0	6	2015	1 	2 
1275	19	1	0	4	2015	1 	3 
1276	19	0	0	1	2015	1 	4 
1277	20	5	1	0	2015	1 	1 
1278	20	19	0	13	2015	1 	2 
1279	20	2	0	15	2015	1 	3 
1280	20	0	0	12	2015	1 	4 
1281	21	8	0	0	2015	1 	1 
1282	21	2	3	3	2015	1 	2 
1283	21	0	0	8	2015	1 	3 
1284	21	0	0	3	2015	1 	4 
1285	28	3	0	1	2015	1 	1 
1286	28	4	1	2	2015	1 	2 
1287	28	1	1	4	2015	1 	3 
1288	28	0	0	1	2015	1 	4 
1289	29	0	0	0	2015	1 	1 
1290	29	5	1	1	2015	1 	2 
1291	29	1	0	8	2015	1 	3 
1292	29	1	1	5	2015	1 	4 
1293	30	2	0	1	2015	1 	1 
1294	30	2	0	3	2015	1 	2 
1295	30	0	0	1	2015	1 	3 
1296	30	2	0	3	2015	1 	4 
1297	22	3	0	0	2015	1 	1 
1298	22	5	0	4	2015	1 	2 
1299	22	2	0	16	2015	1 	3 
1300	22	0	0	6	2015	1 	4 
1301	23	5	0	3	2015	1 	1 
1302	23	7	2	10	2015	1 	2 
1303	23	1	0	1	2015	1 	3 
1304	23	0	0	1	2015	1 	4 
1305	24	1	0	0	2015	1 	1 
1306	24	4	0	1	2015	1 	2 
1307	24	5	2	3	2015	1 	3 
1308	24	1	0	2	2015	1 	4 
1309	25	2	0	0	2015	1 	1 
1310	25	8	1	8	2015	1 	2 
1311	25	0	5	13	2015	1 	3 
1312	25	0	0	3	2015	1 	4 
1313	26	2	0	0	2015	1 	1 
1314	26	5	0	2	2015	1 	2 
1315	26	0	1	2	2015	1 	3 
1316	26	0	1	2	2015	1 	4 
1317	27	3	0	0	2015	1 	1 
1318	27	4	0	3	2015	1 	2 
1319	27	0	0	2	2015	1 	3 
1320	27	0	0	4	2015	1 	4 
1321	4 	0	0	0	2015	2 	1 
1322	4 	4	0	3	2015	2 	2 
1323	4 	1	2	5	2015	2 	3 
1324	4 	2	1	5	2015	2 	4 
1325	1 	4	0	0	2015	2 	1 
1326	1 	4	3	3	2015	2 	2 
1327	1 	2	2	6	2015	2 	3 
1328	1 	1	0	3	2015	2 	4 
1329	2 	2	0	0	2015	2 	1 
1330	2 	5	0	2	2015	2 	2 
1331	2 	3	0	14	2015	2 	3 
1332	2 	0	2	5	2015	2 	4 
1333	3 	0	0	0	2015	2 	1 
1334	3 	6	2	7	2015	2 	2 
1335	3 	1	0	7	2015	2 	3 
1336	3 	0	1	23	2015	2 	4 
1337	5 	6	0	0	2015	2 	1 
1338	5 	5	0	8	2015	2 	2 
1339	5 	0	1	3	2015	2 	3 
1340	5 	0	0	1	2015	2 	4 
1341	6 	5	0	0	2015	2 	1 
1342	6 	5	3	8	2015	2 	2 
1343	6 	0	1	1	2015	2 	3 
1344	6 	1	2	18	2015	2 	4 
1345	16	0	0	0	2015	2 	1 
1346	16	4	0	4	2015	2 	2 
1347	16	0	0	2	2015	2 	3 
1348	16	0	0	2	2015	2 	4 
1349	17	0	0	0	2015	2 	1 
1350	17	1	0	4	2015	2 	2 
1351	17	1	1	29	2015	2 	3 
1352	17	0	1	14	2015	2 	4 
1353	7 	0	0	0	2015	2 	1 
1354	7 	7	0	3	2015	2 	2 
1355	7 	2	0	8	2015	2 	3 
1356	7 	1	0	1	2015	2 	4 
1357	8 	1	0	0	2015	2 	1 
1358	8 	2	0	6	2015	2 	2 
1359	8 	3	0	17	2015	2 	3 
1360	8 	0	0	1	2015	2 	4 
1361	9 	1	0	0	2015	2 	1 
1362	9 	1	0	2	2015	2 	2 
1363	9 	1	3	7	2015	2 	3 
1364	9 	0	0	0	2015	2 	4 
1365	10	2	0	1	2015	2 	1 
1366	10	4	0	2	2015	2 	2 
1367	10	0	0	1	2015	2 	3 
1368	10	0	0	5	2015	2 	4 
1369	11	2	0	1	2015	2 	1 
1370	11	9	1	3	2015	2 	2 
1371	11	0	0	0	2015	2 	3 
1372	11	0	0	0	2015	2 	4 
1373	12	1	0	1	2015	2 	1 
1374	12	1	1	0	2015	2 	2 
1375	12	1	1	1	2015	2 	3 
1376	12	0	0	1	2015	2 	4 
1377	13	4	0	0	2015	2 	1 
1378	13	9	3	6	2015	2 	2 
1379	13	1	1	23	2015	2 	3 
1380	13	0	2	48	2015	2 	4 
1381	14	2	0	0	2015	2 	1 
1382	14	6	0	13	2015	2 	2 
1383	14	0	0	3	2015	2 	3 
1384	14	0	1	4	2015	2 	4 
1385	15	2	0	0	2015	2 	1 
1386	15	4	1	2	2015	2 	2 
1387	15	0	0	2	2015	2 	3 
1388	15	0	1	0	2015	2 	4 
1389	18	6	0	2	2015	2 	1 
1390	18	5	1	5	2015	2 	2 
1391	18	2	0	1	2015	2 	3 
1392	18	0	0	3	2015	2 	4 
1393	19	5	0	0	2015	2 	1 
1394	19	5	0	6	2015	2 	2 
1395	19	1	0	4	2015	2 	3 
1396	19	0	0	1	2015	2 	4 
1397	20	6	0	0	2015	2 	1 
1398	20	19	0	10	2015	2 	2 
1399	20	2	0	15	2015	2 	3 
1400	20	0	0	11	2015	2 	4 
1401	21	10	0	0	2015	2 	1 
1402	21	2	1	1	2015	2 	2 
1403	21	0	0	5	2015	2 	3 
1404	21	0	0	4	2015	2 	4 
1405	28	3	0	0	2015	2 	1 
1406	28	4	1	2	2015	2 	2 
1407	28	1	1	3	2015	2 	3 
1408	28	0	0	1	2015	2 	4 
1409	29	0	0	0	2015	2 	1 
1410	29	5	1	1	2015	2 	2 
1411	29	1	0	4	2015	2 	3 
1412	29	1	1	4	2015	2 	4 
1413	30	2	0	1	2015	2 	1 
1414	30	2	0	5	2015	2 	2 
1415	30	0	0	1	2015	2 	3 
1416	30	2	1	4	2015	2 	4 
1417	22	3	0	0	2015	2 	1 
1418	22	6	1	5	2015	2 	2 
1419	22	2	2	12	2015	2 	3 
1420	22	0	0	5	2015	2 	4 
1421	23	5	0	2	2015	2 	1 
1422	23	7	2	10	2015	2 	2 
1423	23	1	0	1	2015	2 	3 
1424	23	0	0	2	2015	2 	4 
1425	24	1	0	0	2015	2 	1 
1426	24	5	0	1	2015	2 	2 
1427	24	4	2	3	2015	2 	3 
1428	24	1	0	1	2015	2 	4 
1429	25	2	0	0	2015	2 	1 
1430	25	8	0	9	2015	2 	2 
1431	25	0	5	12	2015	2 	3 
1432	25	0	0	3	2015	2 	4 
1433	26	2	0	0	2015	2 	1 
1434	26	5	0	1	2015	2 	2 
1435	26	0	1	2	2015	2 	3 
1436	26	0	1	1	2015	2 	4 
1437	27	3	0	0	2015	2 	1 
1438	27	5	0	2	2015	2 	2 
1439	27	0	0	2	2015	2 	3 
1440	27	0	0	3	2015	2 	4 
1441	4 	0	0	0	2016	1 	1 
1442	4 	5	0	2	2016	1 	2 
1443	4 	1	3	6	2016	1 	3 
1444	4 	1	0	5	2016	1 	4 
1445	1 	4	0	0	2016	1 	1 
1446	1 	4	3	1	2016	1 	2 
1447	1 	2	0	8	2016	1 	3 
1448	1 	1	0	3	2016	1 	4 
1449	2 	2	0	0	2016	1 	1 
1450	2 	5	0	2	2016	1 	2 
1451	2 	3	0	15	2016	1 	3 
1452	2 	0	2	8	2016	1 	4 
1453	3 	0	0	0	2016	1 	1 
1454	3 	7	1	7	2016	1 	2 
1455	3 	1	1	6	2016	1 	3 
1456	3 	0	3	24	2016	1 	4 
1457	5 	5	0	0	2016	1 	1 
1458	5 	5	0	9	2016	1 	2 
1459	5 	0	1	1	2016	1 	3 
1460	5 	0	0	3	2016	1 	4 
1461	6 	6	0	0	2016	1 	1 
1462	6 	4	4	4	2016	1 	2 
1463	6 	0	1	4	2016	1 	3 
1464	6 	1	4	5	2016	1 	4 
1465	17	0	0	0	2016	1 	1 
1466	17	1	0	3	2016	1 	2 
1467	17	1	1	38	2016	1 	3 
1468	17	0	1	15	2016	1 	4 
1469	16	0	0	0	2016	1 	1 
1470	16	3	0	2	2016	1 	2 
1471	16	0	1	5	2016	1 	3 
1472	16	0	1	5	2016	1 	4 
1473	8 	1	0	0	2016	1 	1 
1474	8 	4	2	6	2016	1 	2 
1475	8 	2	5	9	2016	1 	3 
1476	8 	0	0	1	2016	1 	4 
1477	9 	1	0	0	2016	1 	1 
1478	9 	1	0	2	2016	1 	2 
1479	9 	1	3	7	2016	1 	3 
1480	9 	0	0	2	2016	1 	4 
1481	7 	0	0	0	2016	1 	1 
1482	7 	6	0	3	2016	1 	2 
1483	7 	2	0	8	2016	1 	3 
1484	7 	0	0	0	2016	1 	4 
1485	18	6	0	1	2016	1 	1 
1486	18	5	0	6	2016	1 	2 
1487	18	2	0	1	2016	1 	3 
1488	18	0	0	5	2016	1 	4 
1489	19	6	0	0	2016	1 	1 
1490	19	4	0	7	2016	1 	2 
1491	19	1	0	4	2016	1 	3 
1492	19	0	0	3	2016	1 	4 
1493	20	7	0	0	2016	1 	1 
1494	20	18	0	9	2016	1 	2 
1495	20	2	0	18	2016	1 	3 
1496	20	0	0	12	2016	1 	4 
1497	21	9	0	0	2016	1 	1 
1498	21	3	1	2	2016	1 	2 
1499	21	0	0	5	2016	1 	3 
1500	21	0	0	6	2016	1 	4 
1501	10	2	0	1	2016	1 	1 
1502	10	4	0	3	2016	1 	2 
1503	10	0	0	2	2016	1 	3 
1504	10	0	1	3	2016	1 	4 
1505	12	1	0	1	2016	1 	1 
1506	12	1	1	0	2016	1 	2 
1507	12	1	1	1	2016	1 	3 
1508	12	0	0	1	2016	1 	4 
1509	11	3	0	0	2016	1 	1 
1510	11	7	1	3	2016	1 	2 
1511	11	0	0	0	2016	1 	3 
1512	11	0	0	0	2016	1 	4 
1513	13	6	0	1	2016	1 	1 
1514	13	10	0	10	2016	1 	2 
1515	13	1	2	16	2016	1 	3 
1516	13	0	1	49	2016	1 	4 
1517	14	2	0	0	2016	1 	1 
1518	14	6	0	11	2016	1 	2 
1519	14	0	0	4	2016	1 	3 
1520	14	0	0	5	2016	1 	4 
1521	15	2	0	0	2016	1 	1 
1522	15	4	0	1	2016	1 	2 
1523	15	0	0	5	2016	1 	3 
1524	15	0	0	2	2016	1 	4 
1525	28	3	0	0	2016	1 	1 
1526	28	4	1	4	2016	1 	2 
1527	28	1	1	3	2016	1 	3 
1528	28	0	0	0	2016	1 	4 
1529	30	2	0	0	2016	1 	1 
1530	30	3	1	2	2016	1 	2 
1531	30	0	0	1	2016	1 	3 
1532	30	1	1	2	2016	1 	4 
1533	29	1	0	0	2016	1 	1 
1534	29	4	1	0	2016	1 	2 
1535	29	1	0	5	2016	1 	3 
1536	29	1	1	2	2016	1 	4 
1537	22	3	0	0	2016	1 	1 
1538	22	6	0	0	2016	1 	2 
1539	22	1	0	0	2016	1 	3 
1540	22	0	0	0	2016	1 	4 
1541	23	6	0	2	2016	1 	1 
1542	23	6	3	11	2016	1 	2 
1543	23	0	0	1	2016	1 	3 
1544	23	0	0	2	2016	1 	4 
1545	26	2	0	0	2016	1 	1 
1546	26	5	0	2	2016	1 	2 
1547	26	0	1	3	2016	1 	3 
1548	26	0	1	1	2016	1 	4 
1549	24	2	0	0	2016	1 	1 
1550	24	5	0	1	2016	1 	2 
1551	24	3	0	6	2016	1 	3 
1552	24	1	1	1	2016	1 	4 
1553	25	2	0	1	2016	1 	1 
1554	25	8	1	8	2016	1 	2 
1555	25	0	4	11	2016	1 	3 
1556	25	0	1	3	2016	1 	4 
1557	27	4	0	0	2016	1 	1 
1558	27	4	0	1	2016	1 	2 
1559	27	0	0	1	2016	1 	3 
1560	27	0	0	4	2016	1 	4 
1561	4 	0	0	0	2016	2 	1 
1562	4 	4	0	2	2016	2 	2 
1563	4 	1	3	7	2016	2 	3 
1564	4 	1	0	5	2016	2 	4 
1565	1 	5	0	0	2016	2 	1 
1566	1 	3	1	5	2016	2 	2 
1567	1 	2	0	8	2016	2 	3 
1568	1 	1	0	2	2016	2 	4 
1569	2 	2	0	0	2016	2 	1 
1570	2 	4	0	3	2016	2 	2 
1571	2 	3	0	15	2016	2 	3 
1572	2 	0	2	7	2016	2 	4 
1573	3 	1	0	0	2016	2 	1 
1574	3 	7	2	3	2016	2 	2 
1575	3 	0	2	5	2016	2 	3 
1576	3 	0	0	27	2016	2 	4 
1577	5 	5	0	0	2016	2 	1 
1578	5 	5	0	8	2016	2 	2 
1579	5 	0	0	3	2016	2 	3 
1580	5 	0	0	3	2016	2 	4 
1581	6 	6	0	2	2016	2 	1 
1582	6 	4	1	12	2016	2 	2 
1583	6 	0	0	3	2016	2 	3 
1584	6 	1	3	7	2016	2 	4 
1585	17	0	0	0	2016	2 	1 
1586	17	1	0	2	2016	2 	2 
1587	17	1	5	20	2016	2 	3 
1588	17	0	2	27	2016	2 	4 
1589	16	0	0	0	2016	2 	1 
1590	16	3	0	3	2016	2 	2 
1591	16	0	1	2	2016	2 	3 
1592	16	0	1	4	2016	2 	4 
1593	8 	1	0	0	2016	2 	1 
1594	8 	4	1	7	2016	2 	2 
1595	8 	2	4	8	2016	2 	3 
1596	8 	0	0	2	2016	2 	4 
1597	9 	1	0	0	2016	2 	1 
1598	9 	1	0	1	2016	2 	2 
1599	9 	1	3	7	2016	2 	3 
1600	9 	0	1	0	2016	2 	4 
1601	7 	6	0	3	2016	2 	1 
1602	7 	2	0	8	2016	2 	2 
1603	7 	0	0	0	2016	2 	3 
1604	7 	0	0	0	2016	2 	4 
1605	18	7	0	1	2016	2 	1 
1606	18	5	1	4	2016	2 	2 
1607	18	1	0	1	2016	2 	3 
1608	18	0	0	5	2016	2 	4 
1609	19	6	0	0	2016	2 	1 
1610	19	4	0	7	2016	2 	2 
1611	19	1	0	4	2016	2 	3 
1612	19	0	0	3	2016	2 	4 
1613	20	7	0	0	2016	2 	1 
1614	20	18	0	9	2016	2 	2 
1615	20	2	0	16	2016	2 	3 
1616	20	0	0	10	2016	2 	4 
1617	21	9	0	0	2016	2 	1 
1618	21	3	0	3	2016	2 	2 
1619	21	0	0	4	2016	2 	3 
1620	21	0	0	2	2016	2 	4 
1621	10	2	0	1	2016	2 	1 
1622	10	4	0	2	2016	2 	2 
1623	10	0	0	2	2016	2 	3 
1624	10	0	0	3	2016	2 	4 
1625	12	1	0	0	2016	2 	1 
1626	12	1	1	1	2016	2 	2 
1627	12	1	1	1	2016	2 	3 
1628	12	0	0	1	2016	2 	4 
1629	11	3	0	0	2016	2 	1 
1630	11	7	0	3	2016	2 	2 
1631	11	0	0	0	2016	2 	3 
1632	11	0	0	0	2016	2 	4 
1633	13	6	0	0	2016	2 	1 
1634	13	10	0	9	2016	2 	2 
1635	13	1	1	22	2016	2 	3 
1636	13	0	0	48	2016	2 	4 
1637	14	2	0	0	2016	2 	1 
1638	14	6	0	11	2016	2 	2 
1639	14	0	0	5	2016	2 	3 
1640	14	0	0	7	2016	2 	4 
1641	15	2	0	0	2016	2 	1 
1642	15	4	0	2	2016	2 	2 
1643	15	0	0	3	2016	2 	3 
1644	15	0	0	2	2016	2 	4 
1645	28	3	0	0	2016	2 	1 
1646	28	4	0	5	2016	2 	2 
1647	28	1	0	4	2016	2 	3 
1648	28	0	0	0	2016	2 	4 
1649	30	2	0	0	2016	2 	1 
1650	30	3	0	3	2016	2 	2 
1651	30	0	1	0	2016	2 	3 
1652	30	1	1	3	2016	2 	4 
1653	29	1	0	0	2016	2 	1 
1654	29	5	1	0	2016	2 	2 
1655	29	0	0	3	2016	2 	3 
1656	29	1	0	4	2016	2 	4 
1657	22	3	0	0	2016	2 	1 
1658	22	4	1	5	2016	2 	2 
1659	22	1	2	13	2016	2 	3 
1660	22	0	0	8	2016	2 	4 
1661	23	6	0	2	2016	2 	1 
1662	23	6	3	10	2016	2 	2 
1663	23	0	0	2	2016	2 	3 
1664	23	0	0	3	2016	2 	4 
1665	26	3	0	0	2016	2 	1 
1666	26	4	0	1	2016	2 	2 
1667	26	0	1	3	2016	2 	3 
1668	26	0	1	4	2016	2 	4 
1669	24	2	0	0	2016	2 	1 
1670	24	5	1	1	2016	2 	2 
1671	24	3	0	6	2016	2 	3 
1672	24	1	0	3	2016	2 	4 
1673	25	2	0	1	2016	2 	1 
1674	25	8	1	7	2016	2 	2 
1675	25	0	4	12	2016	2 	3 
1676	25	0	0	4	2016	2 	4 
1677	27	4	0	0	2016	2 	1 
1678	27	4	0	1	2016	2 	2 
1679	27	0	0	1	2016	2 	3 
1680	27	0	0	4	2016	2 	4 
4899	1 	5	0	0	2017	1 	1 
4900	1 	3	0	3	2017	1 	2 
4901	1 	2	0	6	2017	1 	3 
4902	1 	1	0	2	2017	1 	4 
4903	2 	2	0	0	2017	1 	1 
4904	2 	4	0	5	2017	1 	2 
4905	2 	3	0	14	2017	1 	3 
4906	2 	0	0	10	2017	1 	4 
4907	3 	1	0	0	2017	1 	1 
4908	3 	7	0	5	2017	1 	2 
4909	3 	0	1	6	2017	1 	3 
4910	3 	0	3	20	2017	1 	4 
4911	4 	0	0	0	2017	1 	1 
4912	4 	4	0	2	2017	1 	2 
4913	4 	1	3	5	2017	1 	3 
4914	4 	1	1	4	2017	1 	4 
4915	5 	7	0	0	2017	1 	1 
4916	5 	3	0	7	2017	1 	2 
4917	5 	0	0	3	2017	1 	3 
4918	5 	0	0	2	2017	1 	4 
4919	6 	6	0	1	2017	1 	1 
4920	6 	4	0	10	2017	1 	2 
4921	6 	0	1	3	2017	1 	3 
4922	6 	1	1	7	2017	1 	4 
4923	7 	0	0	0	2017	1 	1 
4924	7 	6	0	2	2017	1 	2 
4925	7 	2	0	8	2017	1 	3 
4926	7 	0	0	1	2017	1 	4 
4927	8 	1	0	0	2017	1 	1 
4928	8 	3	1	6	2017	1 	2 
4929	8 	2	4	9	2017	1 	3 
4930	8 	0	0	2	2017	1 	4 
4931	9 	1	0	0	2017	1 	1 
4932	9 	1	0	1	2017	1 	2 
4933	9 	1	3	7	2017	1 	3 
4934	9 	0	1	0	2017	1 	4 
4935	10	2	0	1	2017	1 	1 
4936	10	4	0	3	2017	1 	2 
4937	10	0	0	2	2017	1 	3 
4938	10	0	0	3	2017	1 	4 
4939	11	3	0	0	2017	1 	1 
4940	11	7	1	3	2017	1 	2 
4941	11	0	0	0	2017	1 	3 
4942	11	0	0	1	2017	1 	4 
4943	12	1	0	0	2017	1 	1 
4944	12	1	1	1	2017	1 	2 
4945	12	1	1	1	2017	1 	3 
4946	12	0	0	0	2017	1 	4 
4947	13	6	0	1	2017	1 	1 
4948	13	11	0	7	2017	1 	2 
4949	13	0	2	19	2017	1 	3 
4950	13	0	1	44	2017	1 	4 
4951	14	2	0	0	2017	1 	1 
4952	14	5	0	7	2017	1 	2 
4953	14	0	0	5	2017	1 	3 
4954	14	0	0	8	2017	1 	4 
4955	15	2	0	0	2017	1 	1 
4956	15	4	1	1	2017	1 	2 
4957	15	0	0	5	2017	1 	3 
4958	15	0	0	1	2017	1 	4 
4959	16	0	0	0	2017	1 	1 
4960	16	3	1	3	2017	1 	2 
4961	16	0	0	4	2017	1 	3 
4962	16	0	1	3	2017	1 	4 
4963	17	0	0	0	2017	1 	1 
4964	17	1	1	3	2017	1 	2 
4965	17	1	3	38	2017	1 	3 
4966	17	0	1	13	2017	1 	4 
4967	18	8	0	2	2017	1 	1 
4968	18	4	1	3	2017	1 	2 
4969	18	1	0	0	2017	1 	3 
4970	18	0	0	6	2017	1 	4 
4971	19	7	0	0	2017	1 	1 
4972	19	4	0	8	2017	1 	2 
4973	19	0	0	4	2017	1 	3 
4974	19	0	0	4	2017	1 	4 
4975	20	7	0	0	2017	1 	1 
4976	20	18	0	10	2017	1 	2 
4977	20	2	0	18	2017	1 	3 
4978	20	0	0	13	2017	1 	4 
4979	21	9	0	0	2017	1 	1 
4980	21	3	1	5	2017	1 	2 
4981	21	0	0	5	2017	1 	3 
4982	21	0	0	3	2017	1 	4 
4983	22	3	0	0	2017	1 	1 
4984	22	4	0	0	2017	1 	2 
4985	22	1	0	0	2017	1 	3 
4986	22	0	0	0	2017	1 	4 
4987	23	5	0	2	2017	1 	1 
4988	23	7	0	15	2017	1 	2 
4989	23	0	0	2	2017	1 	3 
4990	23	0	0	4	2017	1 	4 
4991	24	2	0	0	2017	1 	1 
4992	24	5	1	1	2017	1 	2 
4993	24	3	1	6	2017	1 	3 
4994	24	1	0	2	2017	1 	4 
4995	25	2	0	0	2017	1 	1 
4996	25	8	1	7	2017	1 	2 
4997	25	0	4	10	2017	1 	3 
4998	25	0	0	6	2017	1 	4 
4999	26	3	0	0	2017	1 	1 
5000	26	4	0	0	2017	1 	2 
5001	26	0	1	2	2017	1 	3 
5002	26	0	1	1	2017	1 	4 
5003	27	4	0	0	2017	1 	1 
5004	27	4	0	1	2017	1 	2 
5005	27	0	0	1	2017	1 	3 
5006	27	0	0	5	2017	1 	4 
5007	28	1	0	0	2017	1 	1 
5008	28	5	0	1	2017	1 	2 
5009	28	0	0	5	2017	1 	3 
5010	28	1	0	4	2017	1 	4 
5011	29	4	0	0	2017	1 	1 
5012	29	3	1	4	2017	1 	2 
5013	29	1	0	3	2017	1 	3 
5014	29	0	0	0	2017	1 	4 
5015	30	2	0	0	2017	1 	1 
5016	30	3	0	3	2017	1 	2 
5017	30	0	1	1	2017	1 	3 
5018	30	1	1	3	2017	1 	4 
11326	1 	5	0	0	2017	2 	1 
11327	1 	3	0	4	2017	2 	2 
11328	1 	2	1	4	2017	2 	3 
11329	1 	1	0	2	2017	2 	4 
11330	2 	2	0	0	2017	2 	1 
11331	2 	4	0	4	2017	2 	2 
11332	2 	3	1	13	2017	2 	3 
11333	2 	0	0	9	2017	2 	4 
11334	3 	1	0	0	2017	2 	1 
11335	3 	7	1	4	2017	2 	2 
11336	3 	0	1	6	2017	2 	3 
11337	3 	0	2	20	2017	2 	4 
11338	4 	0	0	0	2017	2 	1 
11339	4 	4	0	2	2017	2 	2 
11340	4 	1	2	7	2017	2 	3 
11341	4 	1	1	6	2017	2 	4 
11342	5 	7	0	0	2017	2 	1 
11343	5 	3	0	8	2017	2 	2 
11344	5 	0	0	3	2017	2 	3 
11345	5 	0	0	2	2017	2 	4 
11346	6 	6	0	2	2017	2 	1 
11347	6 	4	0	13	2017	2 	2 
11348	6 	0	0	4	2017	2 	3 
11349	6 	1	2	12	2017	2 	4 
11350	7 	0	0	0	2017	2 	1 
11351	7 	6	0	4	2017	2 	2 
11352	7 	2	0	8	2017	2 	3 
11353	7 	0	0	3	2017	2 	4 
11354	8 	1	0	0	2017	2 	1 
11355	8 	3	1	6	2017	2 	2 
11356	8 	2	4	9	2017	2 	3 
11357	8 	0	0	3	2017	2 	4 
11358	9 	1	0	0	2017	2 	1 
11359	9 	1	0	1	2017	2 	2 
11360	9 	1	4	5	2017	2 	3 
11361	9 	0	1	0	2017	2 	4 
11362	10	2	0	1	2017	2 	1 
11363	10	4	0	1	2017	2 	2 
11364	10	0	0	2	2017	2 	3 
11365	10	0	0	3	2017	2 	4 
11366	11	3	0	1	2017	2 	1 
11367	11	7	1	2	2017	2 	2 
11368	11	0	0	0	2017	2 	3 
11369	11	0	0	0	2017	2 	4 
11370	12	1	0	0	2017	2 	1 
11371	12	1	1	1	2017	2 	2 
11372	12	1	1	0	2017	2 	3 
11373	12	0	0	0	2017	2 	4 
11374	13	6	0	1	2017	2 	1 
11375	13	11	0	8	2017	2 	2 
11376	13	0	0	19	2017	2 	3 
11377	13	0	2	50	2017	2 	4 
11378	14	2	0	0	2017	2 	1 
11379	14	5	0	8	2017	2 	2 
11380	14	0	0	5	2017	2 	3 
11381	14	0	1	9	2017	2 	4 
11382	15	2	0	0	2017	2 	1 
11383	15	4	0	4	2017	2 	2 
11384	15	0	0	4	2017	2 	3 
11385	15	0	0	1	2017	2 	4 
11386	16	0	2	0	2017	2 	1 
11387	16	3	0	5	2017	2 	2 
11388	16	0	0	4	2017	2 	3 
11389	16	0	0	4	2017	2 	4 
11390	17	0	0	0	2017	2 	1 
11391	17	1	0	2	2017	2 	2 
11392	17	0	1	28	2017	2 	3 
11393	17	0	4	27	2017	2 	4 
11394	18	8	0	1	2017	2 	1 
11395	18	4	0	6	2017	2 	2 
11396	18	1	0	2	2017	2 	3 
11397	18	0	0	6	2017	2 	4 
11398	19	7	0	0	2017	2 	1 
11399	19	4	0	7	2017	2 	2 
11400	19	0	0	4	2017	2 	3 
11401	19	0	0	5	2017	2 	4 
11402	20	9	0	0	2017	2 	1 
11403	20	16	0	10	2017	2 	2 
11404	20	2	0	18	2017	2 	3 
11405	20	0	0	8	2017	2 	4 
11406	21	9	0	0	2017	2 	1 
11407	21	3	1	2	2017	2 	2 
11408	21	0	0	5	2017	2 	3 
11409	21	0	0	4	2017	2 	4 
11410	22	3	0	0	2017	2 	1 
11411	22	4	1	6	2017	2 	2 
11412	22	1	1	13	2017	2 	3 
11413	22	0	0	12	2017	2 	4 
11414	23	5	0	2	2017	2 	1 
11415	23	7	2	12	2017	2 	2 
11416	23	0	0	1	2017	2 	3 
11417	23	0	0	3	2017	2 	4 
11418	24	2	0	0	2017	2 	1 
11419	24	5	1	1	2017	2 	2 
11420	24	3	1	4	2017	2 	3 
11421	24	1	0	3	2017	2 	4 
11422	25	2	0	0	2017	2 	1 
11423	25	8	1	7	2017	2 	2 
11424	25	0	4	11	2017	2 	3 
11425	25	0	0	6	2017	2 	4 
11426	26	3	0	0	2017	2 	1 
11427	26	4	0	1	2017	2 	2 
11428	26	0	1	3	2017	2 	3 
11429	26	0	1	3	2017	2 	4 
11430	27	4	0	0	2017	2 	1 
11431	27	4	0	1	2017	2 	2 
11432	27	0	0	1	2017	2 	3 
11433	27	0	0	5	2017	2 	4 
11434	28	4	0	0	2017	2 	1 
11435	28	3	1	3	2017	2 	2 
11436	28	1	0	4	2017	2 	3 
11437	28	0	0	0	2017	2 	4 
11438	29	1	0	0	2017	2 	1 
11439	29	5	0	1	2017	2 	2 
11440	29	0	0	3	2017	2 	3 
11441	29	1	0	4	2017	2 	4 
11442	30	2	0	0	2017	2 	1 
11443	30	3	0	4	2017	2 	2 
11444	30	0	1	0	2017	2 	3 
11445	30	1	0	4	2017	2 	4 
\.
COPY manuales_indicadores (codigo, proceso, lider, "objProceso", "nombreIndicador", "atriMedir", "objCalidad", "tipoIndicador", frecuencia, "periodoCalculo", tendencia, meta, "objIndicador", rango, formula, "maneraGrafica", "puntoRegistro", resposable, instructivo, "sim_Rango_MA", "num_Rango_MA", "sim_Rango_A", "num_Rango_A", "sim_Rango_I", "num_Rango_I") FROM stdin;
4  	Formación Académica	Vicerrector (a)  Académico(a)	Formar integralmente estudiantes a través de los diferentes Programas, niveles y modalidades de Educación Superior.	Programas Acreditados en Alta Calidad	Formación académica	Mejorar permanentemente la calidad en la docencia, investigación y proyección social de la Universidad.	Eficacia 	Anual	Último mes antes de finalizar cada año	Incrementar	Lograr el 15% de los programas acreditables en Alta Calidad	Medir el porcentaje de los programas académicos acreditados en alta calidad 	>15% Muy Adecuado\r\n= 15% Adecuado\r\n>15% Inadecuado	No. Programas académicos acreditados/ Total de programas académicos de la UDENAR.	Diagrama de Bloque, señalando la relación de los programas acreditados	Sistema de Información Académico 	Profesional Sistema de Autoevaluación, Acreditación y Certificación	Con la información suministrada por la División de Autoevaluación, Acreditación y Certificación, se aplica la fórmula establecida en el manual del indicador y se analiza los resultados	> 	15.00	= 	15.00	< 	15.00
5  	Formación Académica	Vicerrector (a)  Académico(a)	Formar integralmente estudiantes a través de los diferentes Programas, niveles y modalidades de Educación Superior.	Relación de todo el personal Docente con respecto al número de Estudiantes de Pregrado UDENAR.	Capacidad 	Mejorar permanentemente la calidad en la docencia, investigación y proyección social de la Universidad.	Eficacia 	Semestral 	Último mes antes de finalizar cada semestre	Mantener	Mantener la relación 30 estudiantes por docente	Establecer el número de docentes Tiempo Completo con relación a la cantidad de Estudiantes matriculados en la Universidad de Nariño.	=35 Muy Adecuado\r\n29% a 34 Adecuado\r\n>59% Inadecuado	No. de Estudiantes/ Total docentes UDENAR.	Diagrama de Bloque, señalando la relación estudiantes por docente	Diagrama de Bloque, señalando la relación estudiantes por docente	Profesional Información y Estadística	on la información suministrada por el Sistema de Información se obtienen los valores del número de estudiantes y el número de docente, se aplica la fórmula establecida en el manual del indicador y se analiza los resultados	= 	35.00	> 	29.00	> 	59.00
6  	Formación Académica	Vicerrector(a) Académico(a)	Formar integralmente estudiantes a través de los diferentes Programas, niveles y modalidades de Educación Superior.	Deserción Académica por cohorte	Nivel de deserción por cohorte dentro del servicio educativo de cada programa académico	Mejorar permanentemente la calidad en la docencia, investigación y proyección social de la Universidad.	Eficiencia	Anual	Último mes antes de finalizar el año	Disminución 	Disminución de la deserción a un 10% por cohorte.	Medir la capacidad de retención del Proceso “Formación Académica”	< 10% Deserción Muy Adecuado\r\n10 – 15 %  Deserción  Adecuada\r\n>15 % Deserción  Inadecuado	(No.  de Estudiantes que se retiran en forma definitiva del Proceso de Formación Académica por cohorte/No. de Estudiantes Matriculados por periodo en una cohorte)*100	Diagrama de Bloque, señalando el porcentaje obtenido de deserción, frente a la meta.	stadísticas SPADIES  para cada cierre de año	Director de Departamento\r\n\r\nAsesor de Información y Estadística Oficina de Planeación y Desarrollo	Al finalizar cada año se aplica la fórmula y se confronta los resultados del año anterior con los del año actual.	< 	10.00	> 	10.00	> 	15.00
2  	Formación Académica	Vicerrector (a)  Académico(a)	Formar integralmente estudiantes a través de los diferentes Programas, niveles y modalidades de Educación Superior.\r\n	Nivel de formación de docentes tiempo completo.	Formación académica	Mejorar permanentemente la calidad en la docencia, investigación y proyección social de la Universidad.	Eficiencia	Semestral	Último mes antes de finalizar cada semestre	Incremento	70 % de Docentes en nivel de doctorado y maestría	Incrementar el nivel de formación de los docentes Tiempo Completo de la Universidad de Nariño a nivel de doctorado y maestrías.	>70% Muy Adecuado	(Número de Docentes que cumplen con el nivel de formación de doctorado y maestría/ Total de Docentes)*100 	Diagrama de Bloque, señalando el porcentaje de docentes por niveles de formación.	Asignación de puntaje y bases de datos	Profesional Asignación de puntaje – Vicerrectoría Académica	Al finalizar cada semestre se confronta los resultados obtenidos, frente a las metas  propuestas, y se aplica la fórmula del indicador.	> 	70.00	> 	60.00	< 	59.00
3  	Formación Académica	Vicerrector (a)  Académico(a)	Formar integralmente estudiantes a través de los diferentes Programas, niveles y modalidades de Educación Superior.	Relación de todo el personal Docente Tiempo Completo con respecto a los Hora Cátedra 	Capacidad 	Mejorar permanentemente la calidad en la docencia, investigación y proyección social de la Universidad.	Eficacia 	Semestral	Último mes antes de finalizar cada semestre	Mantener 	Mantener la relación 2 docentes HC por Cada TC 	Establecer el número de docentes Tiempo Completo con relación a la cantidad de Horas Cátedra en la Universidad de Nariño.	=2 Muy Adecuado\r\n>2 Inadecuado	No. Docentes Horas Cátedra / Total de Docentes Tiempo Completo de la UDENAR.	Diagrama de Bloque, señalando la relación docente TC por HC	Base de datos docentes Universidad de Nariño	Profesional Información y Estadística	Se debe tener la información relacionada del número de docentes en cada semestre y al finalizar aplicar la formula y confrontar los resultados obtenidos, frente a las metas propuestas y realizar el análisis.\r\n\r\nPara realizar el cálculo de este indicador se debe tener en cuenta las modalidades de vinculación de los docentes DTC = Docentes Tiempo Completo\r\nTCO = Docente Tiempo Completo \r\nHC = Docentes Horas Cátedra\r\nOPS= Docentes por Orden de Prestación de Servicios 	= 	2.00	< 	2.00	> 	2.00
1  	Formación Académca	Vicerrector(a) Académico (a)	Formar integralmente estudiantes a través de los diferentes Programas, niveles y modalidades de Educación Superior.	Nivel de Satisfacción  estudiantil.	Estudiantes del programas que califican la Formación Académica como satisfactoria.	Garantizar la satisfacción de los estudiantes con los servicios prestados de formación académica que ofrece la Universidad de Nariño	Eficacia	Semestral	Mes de marzo para semestre A y mes octubre para semestre B	Mantener (mantener y/o incrementar el nivel de satisfacción estudiantil)	Lograr que el 80% de los estudiantes califiquen la prestación del servicio de formación académica de cada programa académico como satisfactorio.	Medir el nivel de satisfacción que tiene la comunidad estudiantil, en lo que se refiera al servicio educativo impartido por cada uno de los programas académicos de la Universidad de Nariño.	80 – 100 %   Muy Adecuado\r\n70 – 79  % Adecuado\r\n60 – 69  % Inadecuado\r\n< 40 %  Muy inadecuado	(No. de estudiantes que calificaron Excelente, Bueno y Adecuado en la primera pregunta de la encuesta de satisfacción / Total de estudiantes) \n\nCalculo del número de encuestas a  aplicar : Muestra representativa del número de Estudiantes matriculados al periodo académico correspondiente. \n\nPregunta de encuesta: 1. ¿Cómo califica Usted la Formación Académica impartida por el Programa al que pertenece?	Diagrama de Columna, señalando la variación porcentual de cada período.	pagina Web Institucional/indicadoresacademicos	Director de Departamento.	http://indicadoresacademicos.udenar.edu.co/tutorial	> 	80.00	> 	70.00	< 	69.00
7  	Formación Académica	Vicerrector(a) Académico(a)	Formar integralmente estudiantes a través de los diferentes Programas, niveles y modalidades de Educación Superior.	Deserción Académica por periodo	Nivel de deserción por periodo dentro del servicio educativo de cada programa académico	Mejorar permanentemente la calidad en la docencia, investigación y proyección social de la Universidad.	Eficiencia	Anual	Último mes antes de finalizar el año	Disminución 	Disminución al 8% de la deserción observada por Periodo. 	Medir la capacidad de retención del Proceso “Formación Académica”	< 10% Deserción Muy Adecuado\r\n10 – 15 %  Deserción  Adecuada\r\n>15 % Deserción  Inadecuado	No.  de Estudiantes que se retiran en forma definitiva del Proceso de Formación Académica por Periodo/No. de Estudiantes Matriculados por periodo)*100	Diagrama de Bloque, señalando el porcentaje obtenido de deserción, frente a la meta.	Estadísticas SPADIES  para cada cierre de año	irector de DepartamentoAsesor de Información y Estadística Oficina de Planeación y Desarrollo	Al finalizar cada año se aplica la fórmula y se confronta los resultados del año anterior con los del año actual.	< 	10.00	> 	10.00	> 	10.00
\.
COPY programas (snies, nivel, codigo, departamento, nombre, abreviatura, "fechaRegistro", estado) FROM stdin;
2972	1	010	20	Licenciatura en Informática	Lic. Informática	2010	t
16843	1	027	13	Licenciatura en Educación Básica con Enfasis en Humanidades, Lengua Castellana e Inglés	Lic.Edu.Bas.Enf Human LengCastell-Ingles	2010	t
102867	1	888	\N	Técnico Profesional en Cultivo de Cafés Especiales	Tec. Cultivo Cafés Especiales	2013	t
101600	1	111	\N	Tecnología en Gestión de Plantaciones de Cacao	Tecno.Gestión Plantaciones Cacao	2013	t
105374	2	\N	\N	Doctorado en Ciencias Agrarias	Doctorado Ciencias Agrarias	2016	t
105084	2	\N	\N	Especialización en Gerencia Integral en Sistemas de Gestión de Calidad	Esp. Gerencia Integral Sist.Gest.Calidad	2015	t
54420	1	777	\N	Técnica Profesional en Producción de Palma de Aceite	Tec. Producción Palma Aceite	2011	t
102625	2	\N	\N	Especialización en Construcción de Software	Esp. Construcción Software	2013	t
53860	2	\N	\N	Especialización en Derecho Comercial	Esp. Derecho Comercial	2015	t
794	2	\N	\N	Especialización en Derecho Administrativo	Esp. Derecho Administrativo	2015	t
6565	2	\N	\N	Especialización en Alta Gerencia	Esp. Alta Gerencia	2014	t
54419	1	222	\N	Tecnología en Gestión de Plantaciones de Palma de Aceite	Tecno.Gestión Plant Palma Aceite	2009	t
91018	1	999	\N	Técnica Profesional en Operación de Minería Sostenible	Tec. Operación Minería Sostenible	2013	t
90855	1	444	\N	Técnica Profesional en Guianza Turística	Tec. Guianza Turística	2012	t
91450	1	666	\N	Técnica Profesional en Producción de Cacao	Tec. Producción Cacao	2012	t
6566	1	127	30	Ingeniería en Producción Acuícola	Ing. Producción Acuicola	2010	t
3318	1	129	12	Geografía	Geografía	2010	t
4492	1	140	21	Química	Quimica	2010	t
11632	1	160	26	Ingeniería Electrónica	Ing. Electrónica	2010	t
2887	1	105	29	Medicina Veterinaria	Medicina Veterinaria	2010	t
91059	1	555	27	Técnico Profesional en Agroindustria Alimentaria	Tec. Agroindustria Alimentaria	2012	t
102838	2	\N	\N	Especialización en Investigación de Operaciones	Esp. Investigación Operaciones	2013	t
104872	2	\N	\N	Especialización en Seguridad y Salud en el Trabajo	Esp. Seguridad y Salud Trabajo	2015	t
3928	1	102	14	Psicología	Psicología	2010	t
4095	1	109	2	Diseño Industrial	Diseño Industrial	2010	t
103814	1	190	2	Diseño Gráfico	Diseño Gráfico	2010	t
19127	1	192	4	Arquitectura	Arquitectura	2010	t
91019	1	333	6	Tecnología en Gestión Minero Ambiental de los Metales Preciosos	Tecno.Gestión.Minero.Amb. Metales Prec.	2011	t
90860	1	158	8	Contaduría Pública	Contaduria	2011	t
102641	2	\N	\N	Maestría en Agroforestería Tropical	Maestría Agroforestaría Tropical	2013	t
105247	2	\N	\N	Maestría en Ciencias Agrarias	Maestría Ciencias Agrarias	2016	t
103163	2	\N	\N	Maestría en Ciencias Biológicas	Maestría Ciencias Biológicas	2014	t
103165	2	\N	\N	Maestría en Didáctica de la Lengua y la Literatura Españolas	Maestría Didáctica Lengua y LitEspañolas	2014	t
105424	2	\N	\N	Maestría en Gerencia Social	Maestría Gerencia Social	2016	t
102969	2	\N	\N	Maestría en Mercadeo	Maestría Mercadeo	2013	t
103235	2	\N	\N	Maestría en Salud Pública	Maestría Salud Pública	2014	t
783	1	011	20	Licenciatura en Matemáticas	Lic. Matemáticas	2010	t
2715	1	013	11	Licenciatura en Filosofía y Letras	Lic. Filosofía y Letras	2010	t
578	1	018	19	Física	Física	2010	t
16842	1	028	13	Licenciatura en Inglés-Francés	Lic. Inglés-Francés	2010	t
90412	1	003	27	Técnica Profesional en Agroindustria Hortofrutícola	Tec. Agroindustria Hortofrutícola	2010	f
90385	1	004	27	Tecnología en Procesos Agroindustriales	Tecno. Procesos Agroindustriales	2010	f
786	1	051	22	Derecho (Diurno)	Derecho	2010	t
4096	1	057	1	Artes Visuales	Artes Visuales	2010	t
16840	1	059	1	Licenciatura en Artes Visuales	Lic. Artes Visuales	2010	t
91125	1	161	25	Tecnología en Computación Cumbal	Tecnologia Computacion Cumbal	2008	t
101575	1	033	24	Ingeniería Civil Túquerres	Ing. Civil Túquerres	2011	f
789	1	033	24	Ingeniería Civil Pasto	Ing. Civil Pasto	2010	t
101579	1	034	25	Ingeniería de Sistemas Tumaco	Ing. Sistemas Tumaco	2010	t
101580	1	034	25	Ingeniería de Sistemas Ipiales	Ing. Sistemas Ipiales	2010	t
3474	1	034	25	Ingeniería de Sistemas Pasto	Ing. Sistemas Pasto	2010	t
101576	1	035	27	Ingeniería Agroindustrial Ipiales	Ing. Agroindustrial Ipiales	2010	t
101577	1	035	27	Ingeniería Agroindustrial La Unión	Ing. Agroindustrial La Unión	2010	t
6564	1	035	27	Ingeniería Agroindustrial Pasto	Ing. Agroindustrial Pasto	2010	t
105003	1	041	7	Economía Túquerres	Economía Túquerres	2015	t
12696	1	041	7	Economía Pasto	Economía Pasto	2010	t
105565	1	043	8	Administración de Empresas (Diurna) Túquerres	Admon. Empresas Túquerres	2016	t
788	1	043	8	Administración de Empresas (Diurna) Pasto	Admon. Empresas Pasto	2010	t
105337	1	104	15	Sociología Tumaco	Sociología Tumaco	2016	t
3319	1	104	15	Sociología Pasto	Sociología Pasto	2010	t
101578	1	108	6	Ingeniería Agroforestal Tumaco	Ing. Agroforestal Tumaco	2010	t
101916	1	108	6	Ingeniería Agroforestal La Unión	Ing. Agroforestal La Unión	2012	f
4282	1	108	6	Ingeniería Agroforestal Pasto	Ing. Agroforestal Pasto	2010	t
101305	1	123	23	Licenciatura en Lengua Castellana y Literatura Tumaco	Lic. Lengua Castellana-Literatura Tumaco	2010	t
105329	1	179	9	Comercio Internacional Ipiales	Comercio Internacional Ipiales	2016	t
90839	1	179	9	Comercio Internacional Pasto	Comercio Internacional Pasto	2011	t
16841	1	123	23	Licenciatura en Lengua Castellana y Literatura Pasto	Lic. Lengua Castellana-Literatura Pasto	2010	t
105002	1	128	10	Licenciatura en Ciencias Sociales	Lic. Ciencias Sociales	2010	t
105449	1	198	9	Mercadeo Ipiales	Mercadeo Ipiales	2016	t
105450	1	198	9	Mercadeo Túquerres	Mercadeo Túquerres	2016	t
91489	1	198	9	Mercadeo Pasto	Mercadeo Pasto	2012	t
779	1	060	3	Licenciatura en Música	Lic. Música	2010	t
777	1	071	28	Zootecnia	Zootecnia	2010	t
20824	1	076	17	Medicina	Medicina	2010	t
91280	1	089	6	Ingeniería Ambiental	Ing. Ambiental	2011	t
3426	1	095	18	Biología	Biología	2010	t
796	2	\N	\N	Maestría en Etnoliteratura	Maestría Etnoliteratura	2016	t
53430	2	\N	\N	Maestría en Educación	Maestría Educación	2015	t
52548	2	\N	\N	Maestría en Docencia Universitaria	Maestría Docencia Universitaria	2007	t
16901	2	\N	\N	Especialización en Pedagogía de la Creatividad	Esp. Pedagogía Creatividad	2011	t
6690	2	\N	\N	Especialización en Gerencia Social	Esp. Gerencia Social	2016	t
11011	2	\N	\N	Especialización en Finanzas	Esp. Finanzas	2014	t
6672	2	\N	\N	Especialización en Estudios Latinoamericanos	Esp. Estudios Latinoamericanos	2013	t
54102	2	\N	\N	Especialización en Derecho Laboral y Seguridad Social	Esp. Derecho Laboral Seguridad Social	2008	t
7189	2	\N	\N	Doctorado en Ciencias de la Educación	Doctorado Ciencias Educación	2000	f
16844	2	\N	\N	Especialización en Administración Educativa	Esp. Administración Educativa	2000	f
16836	2	\N	\N	Especialización en Docencia Universitaria	Esp. Docencia Universitaria	2000	f
52167	2	\N	\N	Especilización en Estudios e Investigaciones Latinoamericanos	Esp. Estudios e Invest. Latinoamericanos	2006	f
52076	2	\N	\N	Especialización en Gobierno Local	Esp. Gobierno Local	2006	f
20960	2	\N	\N	Especialización en Ingeniería de Carreteras	Esp. Ingeniería Carreteras	2005	f
20595	2	\N	\N	Especialización en Medicina Interna de Pequeños Animales	Esp. Medicina Interna Pequeños Animales	2005	f
4569	2	\N	\N	Especialización en Orientación Educativa y Desarrollo Humano	Esp. Orientación Edu. Desarrollo Humano	2000	f
20591	2	\N	\N	Especialización en Producción de Recursos Alimentarios para Especies Pecuarias	Esp. Produc. Rec. Alimentarios Esp. Pecu	2005	f
20592	2	\N	\N	Especialización en Salud y Producción Sostenible del Hato Lechero	Esp. Salud y Produc. Sost. Hato Lechero	2005	f
53201	2	\N	\N	Maestría en Ciencias Agrarias con Diferentes Enfasis	Maestría Cinecias Agrarias Dif. Enfasis	2007	f
3227	1	179	9	Comercio Internacional y Mercadeo	Comercio Internacional	2010	f
3189	1	161	25	Tecnología en Computación Pasto	Tecnologia Computacion Pasto	2010	f
105805	1	031	5	Ingeniería Agronómica Túquerres	Ing. Agronómica Túquerres	2016	t
20541	1	031	5	Ingeniería Agronómica Buesaco	Ing. Agronómica Buesaco	2004	f
790	1	031	5	Ingeniería Agronómica Pasto	Ing. Agronómica Pasto	2010	t
105369	1	043	8	Administración de Empresas (Diurna) Ipiales	Admon. Empresas Ipiales	2016	t
101558	1	122	23	Licenciatura en Educación Básica con Énfasis en Ciencias Naturales y Educación Ambiental Tumaco	Lic.Edu.Bas.Enf. CienciasNat y Edu.Amb Tumaco	2010	t
10432	1	190	2	Diseño Gráfico y Multimedial	Diseño Gráfico y Multimedial	2007	f
16839	1	122	23	Licenciatura en Educación Básica con Énfasis en Ciencias Naturales y Educación Ambiental Pasto	Lic.Edu.Bas.Enf. CienciasNat y Edu.Amb Pasto	2010	t
1206	0	0  	\N	Universidad de Nariño	UDENAR	\N	t
16837	1	128	10	Licenciatura en Educación Básica con Énfasis en Ciencias Sociales	Lic. Educ. Bas. Enf. Ciencias Sociales	2000	f
8405	1	073	16	Tecnología en Promoción de la Salud	Tecnologia Promoción Salud	2010	t
92400	1	400	17	Auxiliar en Enfermeria	Auxiliar en Enfermeria	2017	t
\.
COPY users (codigo, "user", pass, name, rol, encriptado, email, alternative_email) FROM stdin;
22	dcb201b195282662b8b152c9a5196f39	dcb201b195282662b8b152c9a5196f39	Departamento de Ciencias Jurídicas	0	2aaeafbf04dfc3d307afa06ffa5bf885	derecho@udenar.edu.co	leonardoaem@gmail.com
00	0cd311a704f2627bce2c5429335c5dce	0cd311a704f2627bce2c5429335c5dce	División de Autoevaluación, Acreditacion y Certificación	1	30dcacf001743a948ae54b347ae32739	acreditacioninstitucional@udenar.edu.do	\N
1 	a5e20a44288e0cdae59849bb35749252	a5e20a44288e0cdae59849bb35749252	Departamento de Artes Visuales	0	6ce83f558d3d8dde939f9d3ce2e90ccc	fartesvisu@udenar.edu.co	dptoartesvisualesudenar@gmail.com
8 	8fc941f707be07265b887d36621db259	8fc941f707be07265b887d36621db259	Departamento de Administración de Empresas y Finanzas	0	1602c8cef7ff873e66d80c317b479f08	adempresas@udenar.edu.co	comsasur3@hotmail.com
4 	feb7f9412b6ea62597b6aec005f3a589	feb7f9412b6ea62597b6aec005f3a589	Departamento de Arquitectura	0	e359292798a4fb459373e1f7b2069f9f	arquitectura@udenar.edu.co	pastoplb@hotmail.com
18	6c1ea7d75a46b979a0e4a56c8285740f	6c1ea7d75a46b979a0e4a56c8285740f	Departamento de Biología	0	b9a9e28e0348062fc75b83b0a0dc0426	biologia@udenar.edu.co	biologiaudenar2014@gmail.com
2 	ddec295b11d3ecada7cc2062ba2df049	ddec295b11d3ecada7cc2062ba2df049	Departamento de Diseño	0	6af50ba253581b33cfe89d8e9b28ef32	capdi@udenar.edu.co	jpinar2001@gmail.com
7 	0dcbfa3e8507c240d9f372a0b8053885	0dcbfa3e8507c240d9f372a0b8053885	Departamento de Economía	0	c5273d6494d4b6e7f2d58ea6e42a1935	economia@udenar.edu.co	marcoantonioburgos@gmail.com
26	62236d96a215a8424f0115710d2632c7	62236d96a215a8424f0115710d2632c7	Departamento de Electrónica	0	d9923126c24bd78604208bcc3956a935	electronica@udenar.edu.co	javierrevelof@gmail.com
24	bb079f5f43754fdf4b824ffafb10770c	bb079f5f43754fdf4b824ffafb10770c	Departamento de Ingeniería Civil	0	74331c6fda9cc39bd8de02e655eaa0a7	incivil@udenar.edu.co	gmunozrica58@hotmail.com
13	f5fa106c71138185b606e5de40317205	f5fa106c71138185b606e5de40317205	Departamento de Lingüística e Idiomas	0	2d0c9b68f537be20147041bfcc4b518b	linidiomas@udenar.edu.co	edmundomora@gmail.com
23	a85f7cf6ea074cb019a07970d85747fa	a85f7cf6ea074cb019a07970d85747fa	Departamento de Estudios Pedagógicos	0	210706d48bc3eedac6904b2bb27ed66f	facedu@udenar.edu.co	renerene40@yahoo.es
19	aca10b2e53c67fe247e857054ed65c7b	aca10b2e53c67fe247e857054ed65c7b	Departamento de Física	0	b8f5642ae962ffab8ffc5701c27437e2	fisica@udenar.edu.co	lportillas@yahoo.es
12	1a542b8f4f57f499bf1d3eea2a354f45	1a542b8f4f57f499bf1d3eea2a354f45	Departamento de Geografía	0	15b98849ad95ccd81cb07347d4835cc3	geografia@udenar.edu.co	pachitomora@yahoo.com
20	008c9c6db07b7d4b8f2a3ea20c98ebf4	008c9c6db07b7d4b8f2a3ea20c98ebf4	Departamento de Matemáticas y Estadística	0	f87aca536f75d1449b70c9c3069ee5bd	matematicas@udenar.edu.co	samolo@udenar.edu.co
17	b2f7ab0ac61dd0c305e0f896ef1fb12e	b2f7ab0ac61dd0c305e0f896ef1fb12e	Departamento de Medicina	0	c71e9258cf2010b2ef380d4107e8c606	medicina@udenar.edu.co	medicinaudenar@hotmail.com
3 	ddc88111e7c6437760bf9c1e7f267b47	ddc88111e7c6437760bf9c1e7f267b47	Departamento de Música	0	544e49aafe8644cbc8054cf3337b342f	musica@udenar.edu.co	cabemuz10@gmail.com
27	d4e13452963cd3f20e523694c0df75ea	d4e13452963cd3f20e523694c0df75ea	Departamento de Procesos Industriales	0	4c4747704c6acfad9fcad421c94a4ac4	inagroindustrial@udenar.edu.co	diegomejiaespana@gmail.com
28	b3938acdc222244b09bcd634f565155f	b3938acdc222244b09bcd634f565155f	Departamento de Producción y Procesamiento Animal	0	5dad87f2ffcb23508e62c51ebaa3f5b7	zootecnia@udenar.edu.co	eviteri@udenar.edu.co
5 	975d9143434ae304b7a26a61c72f7d9a	975d9143434ae304b7a26a61c72f7d9a	Departamento de Producción y Sanidad Vegetal	0	62779dc4b836ec1306cf3dffd5f31993	inagronomica@udenar.edu.co	cienciasagricolas@udenar.edu.co
21	6de84f716fd4ad044fefb91742644052	6de84f716fd4ad044fefb91742644052	Departamento de Química	0	3ef5922ba38a40f54b2a2c0aa0aebd15	quimica@udenar.edu.co	soximde@gmail.com
6 	18f7c242622e9dae5da9d1fc9b422afb	18f7c242622e9dae5da9d1fc9b422afb	Departamento de Recursos Naturales y Sistemas Agroforestales	0	378855ef7659b4b152cb53d6d7c8fd58	inagroforestal@udenar.edu.co	agroforesteria@udenar.edu.co
16	47d868a6033d8a9240ff39f4ccfb5af2	47d868a6033d8a9240ff39f4ccfb5af2	Departamento de Promoción de la Salud	0	66b240a8443f486c3cfd4cd641a9b959	tecprosalud@udenar.edu.co	tecpromsalud@gmail.com\r\n
14	2dfe6016ac7495abd15dd0aac9a8f293	2dfe6016ac7495abd15dd0aac9a8f293	Departamento de Psicología	0	52a2d9eb7cbbb862398d997b4261cf5f	psicologia@udenar.edu.co	psicologiaudenar@gmail.com
30	ae3272062ae7edb666e8dd33eda728be	ae3272062ae7edb666e8dd33eda728be	Departamento de Recursos Hidrobiológicos	0	81e647f07c139709ed99749270a34a89	ipa@udenar.edu.co	\N
29	00f0ecd3de42cef2863d0e008a4fed2f	00f0ecd3de42cef2863d0e008a4fed2f	Departamento de Salud Animal	0	d3acfd4c3decdad46f4d848444a854ce	veterinaria@udenar.edu.co	bolivarlf@gmail.com
25	5cf65da0febb46b069003add867c3096	5cf65da0febb46b069003add867c3096	Departamento de Sistemas	0	10f48d8f58078dbcdd451cf684025c54	insistemas@udenar.edu.co	mbolanos@udenar.edu.co
15	6a65cd5eb1456a178b2f7e7bca02b0ce	6a65cd5eb1456a178b2f7e7bca02b0ce	Departamento de Sociología	0	01009a6238127e8f017dd39b1a0ca962	sociologia@udenar.edu.co	rioviedo@yahoo.com
10	d07895a54abcdc6db06684d8cb53389a	d07895a54abcdc6db06684d8cb53389a	Departamento de Ciencias Sociales	0	745636ef595e4b0721787533686df2b5	licsociales@udenar.edu.co	merazocoral@gmail.com
99	5f360e2e8bcb4274b4f9c23b6066f03b	5f360e2e8bcb4274b4f9c23b6066f03b	Vicerrectoría Académica	1	5f360e2e8bcb4274b4f9c23b6066f03b	v.academica@udenar.edu.co	\N
11	8d9cf576c5110bbc3c74a5cc5112a51f	8d9cf576c5110bbc3c74a5cc5112a51f	Departamento de Filosofía	0	7f3b7b26a2a1ea13f2760d64ecf1a1c0	filosofia@udenar.edu.co	manrique@udenar.edu.co
9 	2a0a0798dd43023ab30bdd4a777f4225	7a43bd1709ef441f1b3b3fa71c1175da	Departamento de Comercio Internacional y Mercadeo	0	c1ba95bb040905d1ea4c25d2fbd9768b	cim@udenar.edu.co	\N
\.
--
-- Definition for index KPI_Desercion_Cohorte_idx (OID = 19492) : 
--
SET search_path = "Datawarehouse", pg_catalog;
ALTER TABLE ONLY "KPI_Desercion_Cohorte"
    ADD CONSTRAINT "KPI_Desercion_Cohorte_idx"
    PRIMARY KEY (programa, periodo);
--
-- Definition for index KPI_Desercion_Periodo_idx (OID = 19494) : 
--
ALTER TABLE ONLY "KPI_Desercion_Periodo"
    ADD CONSTRAINT "KPI_Desercion_Periodo_idx"
    PRIMARY KEY (programa, periodo);
--
-- Definition for index KPI_Nivel_Satisfaccion_pkey (OID = 19496) : 
--
ALTER TABLE ONLY "KPI_Nivel_Satisfaccion"
    ADD CONSTRAINT "KPI_Nivel_Satisfaccion_pkey"
    PRIMARY KEY ("Programa", "Anho");
--
-- Definition for index acreditacion_alta_calidad_pkey (OID = 19498) : 
--
SET search_path = public, pg_catalog;
ALTER TABLE ONLY acreditacion_alta_calidad
    ADD CONSTRAINT acreditacion_alta_calidad_pkey
    PRIMARY KEY (resolucion);
--
-- Definition for index formacion_departamento_pkey (OID = 19500) : 
--
ALTER TABLE ONLY formacion_departamento
    ADD CONSTRAINT formacion_departamento_pkey
    PRIMARY KEY (cod_forma_dep);
--
-- Definition for index formacion_pkey (OID = 19502) : 
--
ALTER TABLE ONLY formacion
    ADD CONSTRAINT formacion_pkey
    PRIMARY KEY (cod_formacion);
--
-- Definition for index manuales_indicadores_pkey (OID = 19504) : 
--
ALTER TABLE ONLY manuales_indicadores
    ADD CONSTRAINT manuales_indicadores_pkey
    PRIMARY KEY (codigo);
--
-- Definition for index programas_pkey (OID = 19506) : 
--
ALTER TABLE ONLY programas
    ADD CONSTRAINT programas_pkey
    PRIMARY KEY (snies);
--
-- Definition for index users_codigo_key (OID = 19508) : 
--
ALTER TABLE ONLY users
    ADD CONSTRAINT users_codigo_key
    UNIQUE (codigo);
--
-- Definition for index users_pkey (OID = 19510) : 
--
ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey
    PRIMARY KEY ("user", pass);
--
-- Definition for index KPI_Acreditacion_fk (OID = 19520) : 
--
SET search_path = "Datawarehouse", pg_catalog;
ALTER TABLE ONLY "KPI_Acreditacion"
    ADD CONSTRAINT "KPI_Acreditacion_fk"
    FOREIGN KEY ("manual_Acredita") REFERENCES public.manuales_indicadores(codigo);
--
-- Definition for index KPI_Cohort_Dropout_fk (OID = 19525) : 
--
ALTER TABLE ONLY "KPI_Desercion_Cohorte"
    ADD CONSTRAINT "KPI_Cohort_Dropout_fk"
    FOREIGN KEY (programa) REFERENCES public.programas(snies);
--
-- Definition for index KPI_Desercion_Cohorte_fk (OID = 19530) : 
--
ALTER TABLE ONLY "KPI_Desercion_Cohorte"
    ADD CONSTRAINT "KPI_Desercion_Cohorte_fk"
    FOREIGN KEY (manual) REFERENCES public.manuales_indicadores(codigo);
--
-- Definition for index KPI_Desercion_Periodo_fk (OID = 19535) : 
--
ALTER TABLE ONLY "KPI_Desercion_Periodo"
    ADD CONSTRAINT "KPI_Desercion_Periodo_fk"
    FOREIGN KEY (manual) REFERENCES public.manuales_indicadores(codigo);
--
-- Definition for index KPI_Estudiantes_por_Docentes_TC_fk (OID = 19540) : 
--
ALTER TABLE ONLY "KPI_Estudiantes_por_Docentes_TC"
    ADD CONSTRAINT "KPI_Estudiantes_por_Docentes_TC_fk"
    FOREIGN KEY ("manual_Estu_Docente") REFERENCES public.manuales_indicadores(codigo);
--
-- Definition for index KPI_Formacion_fk (OID = 19550) : 
--
ALTER TABLE ONLY "KPI_Formacion"
    ADD CONSTRAINT "KPI_Formacion_fk"
    FOREIGN KEY (formacion) REFERENCES public.formacion(cod_formacion);
--
-- Definition for index KPI_Formacion_fk1 (OID = 19555) : 
--
ALTER TABLE ONLY "KPI_Formacion"
    ADD CONSTRAINT "KPI_Formacion_fk1"
    FOREIGN KEY ("manual_Formacion") REFERENCES public.manuales_indicadores(codigo);
--
-- Definition for index KPI_Nivel_Satisfaccion_fk (OID = 19560) : 
--
ALTER TABLE ONLY "KPI_Nivel_Satisfaccion"
    ADD CONSTRAINT "KPI_Nivel_Satisfaccion_fk"
    FOREIGN KEY (manual) REFERENCES public.manuales_indicadores(codigo);
--
-- Definition for index KPI_Period_Dropout_fk (OID = 19565) : 
--
ALTER TABLE ONLY "KPI_Desercion_Periodo"
    ADD CONSTRAINT "KPI_Period_Dropout_fk"
    FOREIGN KEY (programa) REFERENCES public.programas(snies);
--
-- Definition for index KPI_Relacion_Docentes_fk (OID = 19570) : 
--
ALTER TABLE ONLY "KPI_Relacion_Docentes"
    ADD CONSTRAINT "KPI_Relacion_Docentes_fk"
    FOREIGN KEY ("manual_Rela") REFERENCES public.manuales_indicadores(codigo);
--
-- Definition for index KPI_Satisfaction_level_fk (OID = 19575) : 
--
ALTER TABLE ONLY "KPI_Nivel_Satisfaccion"
    ADD CONSTRAINT "KPI_Satisfaction_level_fk"
    FOREIGN KEY ("Programa") REFERENCES public.programas(snies);
--
-- Definition for index acreditacion_alta_calidad_fk (OID = 19580) : 
--
SET search_path = public, pg_catalog;
ALTER TABLE ONLY acreditacion_alta_calidad
    ADD CONSTRAINT acreditacion_alta_calidad_fk
    FOREIGN KEY (programa) REFERENCES programas(snies);
--
-- Definition for index estudiantes_departamento_fk (OID = 19585) : 
--
ALTER TABLE ONLY estudiantes_departamento
    ADD CONSTRAINT estudiantes_departamento_fk
    FOREIGN KEY (departamento) REFERENCES users(codigo);
--
-- Definition for index formacion_departamento_fk (OID = 19590) : 
--
ALTER TABLE ONLY formacion_departamento
    ADD CONSTRAINT formacion_departamento_fk
    FOREIGN KEY (departamento) REFERENCES users(codigo);
--
-- Definition for index formacion_fk (OID = 19595) : 
--
ALTER TABLE ONLY formacion_departamento
    ADD CONSTRAINT formacion_fk
    FOREIGN KEY (formacion) REFERENCES formacion(cod_formacion);
--
-- Definition for trigger tr_actua_satisfaccion (OID = 19512) : 
--
SET search_path = "Datawarehouse", pg_catalog;
CREATE TRIGGER tr_actua_satisfaccion
    BEFORE INSERT ON "KPI_Nivel_Satisfaccion"
    FOR EACH ROW
    EXECUTE PROCEDURE public.fun_actua_satisfaccion ();
--
-- Definition for trigger tr_cohort_desertion (OID = 19513) : 
--
CREATE TRIGGER tr_cohort_desertion
    BEFORE INSERT ON "KPI_Desercion_Cohorte"
    FOR EACH ROW
    EXECUTE PROCEDURE fun_delete_cohort ();
--
-- Definition for trigger tr_period_desertion (OID = 19514) : 
--
CREATE TRIGGER tr_period_desertion
    BEFORE INSERT ON "KPI_Desercion_Periodo"
    FOR EACH ROW
    EXECUTE PROCEDURE fun_delete_period ();
--
-- Definition for trigger tr_relacion (OID = 19515) : 
--
CREATE TRIGGER tr_relacion
    AFTER INSERT OR UPDATE ON "KPI_Formacion"
    FOR EACH ROW
    EXECUTE PROCEDURE fun_actua_relacion ();
--
-- Definition for trigger tr_est_dep (OID = 19516) : 
--
SET search_path = public, pg_catalog;
CREATE TRIGGER tr_est_dep
    BEFORE INSERT ON estudiantes_departamento
    FOR EACH ROW
    EXECUTE PROCEDURE "Actua_Estudiantes_Dep" ();
--
-- Definition for trigger tr_for_dep (OID = 19517) : 
--
CREATE TRIGGER tr_for_dep
    BEFORE INSERT ON formacion_departamento
    FOR EACH ROW
    EXECUTE PROCEDURE "Actua_Formacion_Dep" ();
--
-- Definition for trigger tr_kpi_est_doc (OID = 19518) : 
--
CREATE TRIGGER tr_kpi_est_doc
    AFTER INSERT OR UPDATE ON estudiantes_departamento
    FOR EACH ROW
    EXECUTE PROCEDURE "Fun_Actua_KPI_Est_Doc" ();
--
-- Definition for trigger tr_kpi_form (OID = 19519) : 
--
CREATE TRIGGER tr_kpi_form
    AFTER INSERT OR UPDATE ON formacion_departamento
    FOR EACH ROW
    EXECUTE PROCEDURE "Fun_Actua_KPI_Form" ();
--
-- Definition for trigger tr_kpi_est_doc_udenar (OID = 19804) : 
--
CREATE TRIGGER tr_kpi_est_doc_udenar
    AFTER INSERT OR UPDATE ON estudiantes_departamento
    FOR EACH ROW
    EXECUTE PROCEDURE "Fun_Actua_KPI_Est_Doc_UDENAR" ();
--
-- Data for sequence public.estudiantes_departamento_cod_est_dep_seq (OID = 19462)
--
SELECT pg_catalog.setval('estudiantes_departamento_cod_est_dep_seq', 1, false);
--
-- Data for sequence public.formacion_departamento_cod_forma_dep_seq (OID = 19470)
--
SELECT pg_catalog.setval('formacion_departamento_cod_forma_dep_seq', 11445, true);
--
-- Comments
--
COMMENT ON SCHEMA public IS 'standard public schema';
COMMENT ON COLUMN public.users.email IS 'correo de cada departamento para recuperar contraseña';
