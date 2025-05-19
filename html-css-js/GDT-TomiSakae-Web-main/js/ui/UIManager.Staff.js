(function () {
    function a() {
        var a = GameManager.company;
        if (a.cash < m) $(".okButtonWrapper").effect("shake", {
            times: 2,
            distance: 5
        }, 50);
        else {
            a.adjustCash(-m, "Find Staff".localize("heading"));
            var b = l / 100,
                c = 1.5 + 1.5 * b;
            Tutorial.hiringStaff(c);
            a.notifications.push(new Notification("{HireStaff}", null, null, c));
            GameManager.uiSettings.findStaffData = {
                costs: m,
                ratio: b,
                tests: k.map(function (a) {
                    return a.id
                }),
                slot: f,
                startWeek: GameManager.company.currentWeek,
                targetWeek: GameManager.company.currentWeek + c,
                seed: Math.floor(65535 *
                    a.getRandom())
            };
            k.first();
            UI.closeModal()
        }
    }
    var b = [{
        id: "ComplexAlgorithms",
        name: "Complex Algorithms".localize(),
        minT: 0.6
    }, {
        id: "GameDemo",
        name: "Game Demo".localize(),
        minD: 0.3,
        minT: 0.3
    }, {
        id: "Showreel",
        name: "Showreel".localize(),
        minD: 0.6
    }];
    UI.isStaffSearchInProgress = function () {
        return GameManager.uiSettings ? null != GameManager.uiSettings.findStaffData : !1
    };
    var c;
    GameManager.addTickListener(function () {
        if (UI.isStaffSearchInProgress() && GameManager.company) {
            var a = GameManager.uiSettings.findStaffData,
                a = ((GameManager.company.currentWeek -
                    a.startWeek) / (a.targetWeek - a.startWeek)).clamp(0, 1);
            c || (c = $("#canvasContainer"));
            var b = c.find(".hireStaffButtonBase");
            b.hasClass("hireStaffButton") && (b.unbind("click").removeClass("hireStaffButton").find(".hireButtonLabel").text("Searching...".localize("button")), UI.maxFont("bold", b.find(".hireButtonLabel"), 12));
            b.find(".hireStaffProgress").css("width", 100 * a + "%")
        }
    }, !0);
    var f = 0;
    UI.showFindStaffWindow = function (c) {
        if (!UI.isStaffSearchInProgress()) {
            f = c;
            c = $(".hireStaffBudgetSlider");
            c.empty();
            var l = $('<div class="budgetSlider"></div>').slider({
                orientation: "horizontal",
                range: "min",
                min: 0,
                max: 100,
                value: 0,
                animate: "fast",
                slide: function (a, b) {
                    var c = $(b.handle).closest(".budgetSlider");
                    if (!c.hasClass("budgetSlider")) throw "couldn't find target slider";
                    c.slider("value", b.value);
                    g()
                }
            });
            c.append(l);
            m = 0;
            k = [];
            c = $(".findStaffFilters");
            c.empty();
            for (l = 0; l < b.length; l++) c.append(d(b[l]));
            $("#findStaffDialog").find(".okButton").clickExcl(a);
            UI.showModalContent("#findStaffDialog", {
                close: !0,
                onOpen: function () {
                    g()
                }
            })
        }
    };
    var d = function (a) {
        var b = $('<div class="selectableGameFeatureItem"></div>').text(a.name);
        b.clickExcl(function () {
            b.hasClass("selectedFeature") ? (b.removeClass("selectedFeature"), k = []) : (b.parent().find(".selectableGameFeatureItem").removeClass("selectedFeature"), k = [], b.addClass("selectedFeature"), k.push(a))
        });
        return b
    },
        k = [],
        m = 0,
        l = 0,
        g = function () {
            var a = $(".simplemodal-data"),
                b = a.find(".budgetSlider").slider("value"),
                c, d = b / 100;
            c = (d /= 1) * d;
            d *= c;
            c = Math.floor(2 + 198 * (0 + 1 * (-0.5 * d * c + 3 * c * c + -3.5 * d + 2 * c)));
            m = c *= 1E4;
            l = b;
            a = a.find(".windowCostLabel");
            UI.maxFont(void 0, a, 20, "Cost: {0}".localize().format(UI.getShortNumberString(m)));
            a.toggleClass("red", m > GameManager.company.cash)
        };
    UI._generateJobApplicants = function () {
        var a = GameManager.uiSettings.findStaffData;
        a || (a = {
            ratio: 0.1,
            tests: []
        });
        a.seed || (a.seed = Math.floor(65535 * GameManager.company.getRandom()));
        for (var c = a.ratio, d = b.first(function (b) {
            return b.id == a.tests.first()
        }), f = GameManager.company, g = new MersenneTwister(a.seed), k = [], l = Math.floor(2 + 3 * (c + 0.2).clamp(0, 1)), m = 0, n = 4 == f.currentLevel ? 0.8 : 0.4, H = GameManager.company.staff.map(function (a) {
            return a.name
        }), G = 0; G < l; G++) {
            var I = c /
                3 + (1 - c / 3) * g.random();
            0.95 <= g.random() && (n += 0.2);
            var N = 0.2 + n * I,
                O = Math.floor(5 * N).clamp(1, 5),
                M = 1,
                R = 0;
            d && (d.minT && (M -= d.minT), d.minD && (R = d.minD, M -= R));
            var S = 200 * O,
                M = S * R + S * M * g.random(),
                S = S - M,
                Q = g.random(),
                R = 0.2 + n * Q,
                P = g.random(),
                W = 0.2 + n * P,
                Q = 0.5 < P && 0.5 < I && 0.5 < Q;
            if (!Q && 2 > m && g.random() <= (c + 0.1).clamp(0, 0.7)) G--, m++;
            else {
                var m = 0,
                    P = !1,
                    I = "male",
                    U, P = 0.25;
                f.flags.sponsoredWomenInTech && (P = 0.5);
                g.random() < P && (I = "female");
                do Q ? (U = 0.5 > S / M ? "female" === I ? t.pickRandom(g) : p.pickRandom(g) : 0.5 > M / S ? "female" === I ? u.pickRandom(g) :
                    r.pickRandom(g) : "female" === I ? q.pickRandom(g) : s.pickRandom(g), P = !0) : (U = "female" === I ? v.pickRandom(g) + " " + z.pickRandom(g) : A.pickRandom(g) + " " + z.pickRandom(g), P = !1); while (-1 != H.indexOf(U));
                H.push(U);
                O *= Character.BASE_SALARY_PER_LEVEL;
                O += 0.2 * O * g.random() * g.randomSign();
                O = 1E3 * Math.floor(O / 1E3);
                k.push({
                    name: U,
                    qualityFactor: N,
                    technologyFactor: S / 500,
                    designFactor: M / 500,
                    researchFactor: R,
                    speedFactor: W,
                    salary: O,
                    isFamous: P,
                    sex: I
                })
            }
        }
        GDT.fire(GameManager, GDT.eventKeys.gameplay.staffApplicantsGenerated, {
            applicants: k,
            settings: a,
            rng: g
        });
        return k
    };
    UI.showHireStaff = function (a, b) {
        var c = $("#hireStaffDialog"),
            d = UI._generateJobApplicants(),
            f = c.find(".applicantSliderContainer"),
            g = n(f, d);
        c.find(".okButton").clickExclOnce(function () {
            var a = c.find(".rsActiveSlide").find(".staffName").text(),
                b = d.first(function (b) {
                    return b.name == a
                });
            UI._hireStaff(b);
            UI.closeModal()
        });
        f = {
            disableCheckForNotifications: !0,
            close: !0,
            onClose: function () {
                GameManager.uiSettings.findStaffData = void 0;
                VisualsManager.refreshHiringButtons();
                GameManager.removeFromActiveNotifications(a);
                GameManager.resume(!0);
                b && b()
            }
        };
        PlatformShim.ISWIN8 ? g.gdSlider() : f.onOpen = function () {
            g.gdSlider()
        };
        UI.showModalContent("#hireStaffDialog", f)
    };
    var n = function (a, b, c) {
        a.empty();
        c = $('<div class="applicantContainer royalSlider rsDefaultInv"></div>');
        a.append(c);
        a = $("#staffTemplate");
        for (var d = 0; d < b.length; d++) {
            var f = b[d],
                g = a.clone();
            g[0].id = void 0;
            g.find(".staffName").text(f.name);
            var k = f.experience ? LevelCalculator.getLevelFractional(f.experience) : 5 * f.qualityFactor;
            g.find(".staffQ").text("Level: ".localize() +
                Math.floor(k));
            g.find(".staffS").text(Math.floor(500 * f.speedFactor));
            var l = 500 * f.designFactor,
                m = 500 * f.technologyFactor;
            g.find(".staffD").text(Math.floor(l));
            g.find(".staffT").text(Math.floor(m));
            k = 100 / ((l + m) / l);
            l = 100 / ((l + m) / m);
            g.find(".staffDBar").css("width", k - 1 + "%");
            g.find(".staffTBar").css("width", l - 1 + "%");
            g.find(".staffR").text(Math.floor(500 * f.researchFactor));
            g.find(".staffSalary").text("{0} per month".localize().format(UI.getShortNumberString(f.salary)));
            c.append(g)
        }
        return c
    };
    UI._hireStaff =
        function (a) {
            var b = GameManager.company,
                c = 5 * a.qualityFactor,
                c = new Character({
                    id: GameManager.getGUID(),
                    name: a.name,
                    dF: a.designFactor,
                    tF: a.technologyFactor,
                    speedF: a.speedFactor,
                    qualityF: Math.floor(c) / 5,
                    experience: LevelCalculator.getXpForLevel(c),
                    researchF: a.researchFactor,
                    salary: a.salary,
                    efficiency: 0.05,
                    slot: GameManager.uiSettings.findStaffData.slot,
                    sex: a.sex
                });
            GameManager.setBodyAndHead(c);
            c.flags.hiredTimestamp = GameManager.gameTime;
            c.flags.nextVacation = GameManager.gameTime + 48E3 * GameManager.SECONDS_PER_WEEK;
            c.flags.workload = 0;
            GameManager.uiSettings.findStaffData = null;
            b.staff.forEach(function (a) {
                a.adjustEfficiency(-0.4)
            });
            b.staff.push(c);
            Tutorial.staffHired();
            GDT.fire(GameManager, GDT.eventKeys.gameplay.staffHired, {
                character: c,
                applicant: a
            });
            VisualsManager.reloadAllCharacters();
            GameManager.company.staff[GameManager.company.staff.length - 1].startAnimations();
            Research.checkForNewResearch();
            VisualsManager.addComputer(c);
            VisualsManager.refreshHiringButtons();
            VisualsManager.refreshTrainingOverlays();
            2 < GameManager.company.staff.length &&
                GameManager.enableMediumContracts();
            UI.reset();
            a.isFamous && Achievements.activate(Achievements.hireSomeoneFamous)
        };
    UI.showFireStaffPrompt = function (a) {
        GameManager.company.notifications.insertAt(0, DecisionNotifications.fireEmployee.getNotification(GameManager.company, a))
    };
    UI.showStaffList = function (a) {
        var b = $("#staffListDialog"),
            c = b.find(".staffSliderContainer"),
            d = n(c, GameManager.company.staff);
        b.find(".okButton").clickExclOnce(function () {
            UI.closeModal()
        });
        b = {
            disableCheckForNotifications: !1,
            close: !0,
            onClose: function () {
                a && a()
            }
        };
        PlatformShim.ISWIN8 ? d.gdSlider() : b.onOpen = function () {
            d.gdSlider()
        };
        UI.showModalContent("#staffListDialog", b)
    };
    var r = "Sip Meyer;Christoph Sowyer;James E. Garmack;Johnny Rome;James Di Margiti;Mick Brash;David Draben;Hasir Nebelli;Andres Lamot;Scott Rro;Ben Silverman;Martin Person;Tom References".split(";"),
        p = "Jerry Sole;Richard Chariott;Bill Bright;Christian Robertson;Eric Robertson;Dennis Avelone;Drew Darpyshyn;David Drossman;Peter Polynox;Migeru Mayomoto;Tom Schofer;Ron Raglow;Eduard McGillen;Markus Stonefeather;Bill J. Allen;Jona Chen;Paul Reed;James Romeo".split(";"),
        s = "Warden Vector;Ricky Rartle;Leeroy Rubshaw;Kevin Flin;Ralph Koster;Joe Smodley;Jack Long;Allen Low;Clinton Harris;Arthur Bee;Phillip Fesh;Paul Pres;Kyle Stabler;Ronny Garmel;Dennis Habbabis;Chris Maley;Mark Torris;Tony Rodriguez;Arnt Johnson;Dino Watty".split(";"),
        u = "Dana Benten;Anna Eastfall;Corinne Jo;Anne Kitnis;Tomara Minar;Jane Lean;Caroline Saw;Timea Habori;Laura Bridge;Raddy Janenova;Amy Philipa;Zoe Zamms".split(";"),
        t = "Erica Robinson;Kim Swoft;Brenda Wrathbate;Robin Kunecke;Amy Nenning;Tracey Halferton;Yoko Hanno;Laura Brenda;Amanda Triggs;Kiri Wolftill;Lucy Broadshaw;Aurelia Dupont;Riana Ratchett".split(";"),
        q = "Jane Janeson;Cherie Ray Garner;Jade Haymond;Kelly Santareno;Joan Red;Susie Manly;Emilia Ridgepath;Pauline Zobeck;Rina Brok;Jennifer Cavanagh;Beverly Larand;Laureen Kamo;Heather Hailey".split(";"),
        v = "Mary Patricia Linda Barbara Elizabeth Jennifer Susan Margaret Dorothy Liza Nancy Karen Betty Helen Sandra Donna Carol Ruth Sharon Michelle Laura Sarah Kimberly Deborah Jessica Shirley Cynthia Angela Melissa Brenda Amy Anna Rebecca Virginia Kathleen Pamela Martha Debra Amanda Stephanie Carolyn Christine Marie Janet Catherine Frances Ann Joyce Diane Alice Julie Heather Teresa Doris Gloria Evelyn Jean Cheryl Katherine Joan Ashley Judith Rose Janice Kelly Nicole Judy Christina Kathy Theresa Beverly Denise Tammy Irene Jane Lori Rachel Marilyn Andrea Kathryn Louise Sara Anne Jacqueline Wanda Bonnie Julia Ruby Lois Tina Phyllis Norma Paula Diana Annie Lillian Emily Robin Peggy Crystal Gladys Rita Dawn Connie Florence Tracy Edna Tiffany Carmen Rosa Cindy Grace Wendy Victoria Edith Kim Sherry Sylvia Josephine Thelma Shannon Ethel Ellen Elaine Marjorie Carrie Charlotte Monica Esther Pauline Emma Juanita Anita Rhonda Hazel Amber Eva Debbie April Leslie Clara Lucille Jamie Joanne Eleanore Valerie Danielle Megan Alicia Suzanne Michele Gail Bertha Darlene Veronica Jill Erin Lauren Cathy Joann Lorraine Lynn Sally Regina Erica Beatrice Dolores Bernice Audrey Yvonne Annette June Samantha Marion Dana Stacy Ana Renee Ida Vivian Roberta Holly Brittany Melanie Loretta Yolanda Jeanette Laurie Katie Kristen Vanessa Alma Sue Elsie Beth".split(" "),
        A = "Jacob Michael Joshua Matthew Daniel Christopher Andrew Ethan Joseph William Anthony David Alexander Nicholas Ryan Tyler James John Jonathan Noah Brandon Christian Dylan Samuel Benjamin Nathan Zachary Logan Justin Gabriel Jose Austin Kevin Elijah Caleb Robert Thomas Jordan Cameron Jack Hunter Jackson Angel Isaiah Evan Isaac Mason Luke Jason Gavin Jayden Aaron Connor Aiden Aidan Kyle Juan Charles Luis Adam Lucas Brian Eric Adrian Nathaniel Sean Alex Carlos Ian Bryan Owen Landon Julian Chase Cole Diego Jeremiah Steven Sebastian Xavier Timothy Carter Wyatt Brayden Blake Hayden Devin Cody Richard Seth Dominic Jaden Antonio Miguel Liam Patrick Carson Jesse Tristan Alejandro Henry Victor Trevor Bryce Jake Riley Colin Jared Jeremy Mark Caden Garrett Parker Marcus Vincent Kaleb Kaden Brady Colton Kenneth Joel Oscar Josiah Jorge Cooper Ashton Tanner Eduardo Paul Edward Ivan Preston Maxwell Alan Levi Stephen Grant Nicolas Omar Dakota Alexis George Collin Eli Spencer Gage Max Cristian Ricardo Derek Micah Brody Francisco Nolan Ayden Dalton Shane Peter Damian Jeffrey Brendan Travis Fernando Peyton Conner Andres Javier Giovanni Shawn Braden Jonah Bradley Cesar Emmanuel Manuel Edgar Erik Mario Edwin Johnathan Devon Erick Wesley Oliver Trenton Hector Malachi Jalen Raymond Gregory Abraham Elias Leonardo Sergio Donovan Colby Marco Bryson Martin".split(" "),
        z = "Smith Johnson Williams Jones Brown Davis Miller Wilson Moore Taylor Anderson Thomas Jackson White Harris Martin Thompson Garcia Martinez Robinson Clark Rodriguez Lewis Lee Walker Hall Allen Young Hernandez King Wright Lopez Hill Scott Green Adams Baker Gonzalez Nelson Carter Mitchell Perez Roberts Turner Phillips Campbell Parker Evans Edwards Collins Stewart Sanchez Morris Rogers Reed Cook Morgan Bell Murphy Bailey Rivera Cooper Richardson Cox Howard Ward Torres Peterson Gray Ramirez James Watson Brooks Kelly Sanders Price Bennett Wood Barnes Ross Henderson Coleman Jenkins Perry Powell Long Patterson Hughes Flores Washington Butler Simmons Foster Gonzales Bryant Alexander Russell Griffin Diaz Hayes Myers Ford Hamilton Graham Sullivan Wallace Woods Cole West Jordan Owens Reynolds Fisher Ellis Harrison Gibson Mcdonald Cruz Marshall Ortiz Gomez Murray Freeman Wells Webb Simpson Stevens Tucker Porter Hunter Hicks Crawford Henry Boyd Mason Morales Kennedy Warren Dixon Ramos Reyes Burns Gordon Shaw Holmes Rice Robertson Hunt Black Daniels Palmer Mills Nichols Grant Knight Ferguson Rose Stone Hawkins Dunn Perkins Hudson Spencer Gardner Stephens Payne Pierce Berry Matthews Arnold Wagner Willis Ray Watkins Olson Carroll Duncan Snyder Hart Cunningham Bradley Lane Andrews Ruiz Harper Fox Riley Armstrong Carpenter Weaver Greene Lawrence Elliott Chavez Sims Austin Peters Kelley Franklin Lawson Fields Gutierrez Ryan Schmidt Carr Vasquez Castillo Wheeler Chapman Oliver Montgomery Richards Williamson Johnston Banks Meyer Bishop Mccoy Howell Alvarez Morrison Hansen Fernandez Garza Harvey Little Burton Stanley Nguyen George Jacobs Reid Kim Fuller Lynch Dean Gilbert Garrett Romero Welch Larson Frazier Burke Hanson Day Mendoza Moreno Bowman Medina Fowler Brewer Hoffman Carlson Silva Pearson Holland Douglas Fleming Jensen Vargas Byrd Davidson Hopkins May Terry Herrera Wade Soto Walters Curtis Neal Caldwell Lowe Jennings Barnett Graves Jimenez Horton Shelton Barrett Obrien Castro Sutton Gregory Mckinney Lucas Miles Craig Rodriquez Chambers Holt Lambert Fletcher Watts Bates Hale Rhodes Pena Beck Newman Haynes Mcdaniel Mendez Bush Vaughn Parks Dawson Santiago Norris Hardy Love Steele Curry Powers Schultz Barker Guzman Page Munoz Ball Keller Chandler Weber Leonard Walsh Lyons Ramsey Wolfe Schneider Mullins Benson Sharp Bowen Daniel Barber Cummings Hines Baldwin Griffith Valdez Hubbard Salazar Reeves Warner Stevenson Burgess Santos Tate Cross Garner Mann Mack Moss Thornton Dennis Mcgee Farmer Delgado Aguilar Vega Glover Manning Cohen Harmon Rodgers Robbins Newton Todd Blair Higgins Ingram Reese Cannon Strickland Townsend Potter Goodwin Walton Rowe Hampton Ortega Patton Swanson Joseph Francis Goodman Maldonado Yates Becker Erickson Hodges Rios Conner Adkins Webster Norman Malone Hammond Flowers Cobb Moody Quinn Blake Maxwell Pope Floyd Osborne Paul Mccarthy Guerrero Lindsey Estrada Sandoval Gibbs Tyler Gross Fitzgerald Stokes Doyle Sherman Saunders Wise Colon Gill Alvarado Greer Padilla Simon Waters Nunez Ballard Schwartz Mcbride Houston Christensen Klein Pratt Briggs Parsons Mclaughlin Zimmerman French Buchanan Moran Copeland Roy Pittman Brady Mccormick Holloway Brock Poole Frank Logan Owen Bass Marsh Drake Wong Jefferson Park Morton Abbott Sparks Norton Huff Clayton Massey Lloyd Figueroa Carson Bowers Roberson Barton Tran Lamb Harrington Casey Boone Cortez Clarke Mathis Singleton Wilkins Cain Bryan Underwood Hogan Mckenzie Collier Luna Phelps Mcguire Allison Bridges Wilkerson Nash Summers Atkins".split(" ");
    UI.getRandomMaleFirstName = function () {
        return A.pickRandom()
    };
    UI.getRandomFemaleFirstName = function () {
        return v.pickRandom()
    }
})();