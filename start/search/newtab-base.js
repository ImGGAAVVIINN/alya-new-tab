(function(e) {
    try {
        var t = false;
        function a() {
            var e = parseInt(localStorage.getItem("curTabActive")) || 0;
            var t = [].concat(user["geodata"] ? JSON.parse(user["geodata"]).relate : [], localStorage.getItem("had_wl") ? JSON.parse(localStorage.getItem("had_wl")) : []);
            if (e == 1 && t.length == 0)
                e = 0;
            $("#tabs").tabs({
                active: e,
                activate: function(e, t) {
                    var a = t.newPanel.selector;
                    if (a == "#tab-background") {
                        localStorage.setItem("curTabActive", 0)
                    } else if (a == "#tab-relative-apps") {
                        localStorage.setItem("curTabActive", 1)
                    } else if (a == "#tab-setting") {
                        localStorage.setItem("curTabActive", 2)
                    }
                }
            });
            $("#tab-relative-apps").off("click");
            $("#tab-relative-apps").on("click", function(e) {
                if (e.target.tagName == "INPUT" && e.target.classList.value.indexOf("enableAppAction") > -1) {
                    var t = e.target.dataset.extid;
                    chrome.runtime.sendMessage({
                        appGet: {
                            id: t
                        }
                    }, function(a) {
                        chrome.runtime.sendMessage({
                            appSetEnabled: {
                                id: t,
                                enabled: !a.enabled
                            }
                        }, function() {
                            chrome.runtime.sendMessage("click-" + (a.enabled ? "AppDisable" : "AppEnable"));
                            e.target.setAttribute("data-enabled", !a.enabled)
                        })
                    })
                } else if (e.target.tagName == "BUTTON" && e.target.classList.value.indexOf("installAppAction") > -1) {
                    chrome.runtime.sendMessage("click-AppInstall");
                    chrome.tabs.create({
                        url: "https://chrome.google.com/webstore/detail/" + e.target.dataset.extid + "?utm_campaign=Extensions&utm_medium=relative&utm_source=" + chrome.runtime.id,
                        active: true
                    })
                } else if (e.target.tagName == "A" || e.target.tagName == "IMG") {
                    chrome.runtime.sendMessage("click-AppLink")
                }
            })
        }
        e.loadRelativeApps = function() {
            var t = localStorage.getItem("had_wl") ? JSON.parse(localStorage.getItem("had_wl")) : [];
            var a = user["geodata"] ? JSON.parse(user["geodata"]) : null;
            if (!a)
                return;
            var o = a && a.hasOwnProperty("tophot") ? a.tophot : false;
            var i = a && a.hasOwnProperty("topnew") ? a.topnew : false;
            var l = a && a.relate.length ? a.relate : [];
            var s = [].concat(l, utils.getAppsInList2ThatNotInList1([].concat([{
                id: chrome.runtime.id
            }], l), t));
            if (s.length === 0) {
                $('#tabs li[aria-controls="tab-relative-apps"]').hide();
                return
            }
            $('#tabs li[aria-controls="tab-relative-apps"]').show();
            $("#tab-relative-apps table").empty();
            if ("" + localStorage.getItem("relative_apps_clicked") === "true") {
                $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').removeClass("highlight_blinker")
            } else {
                $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').addClass("highlight_blinker");
                utils.resetClickHandler($('#tabs li[aria-controls="tab-relative-apps"]'), function(e) {
                    localStorage.setItem("relative_apps_clicked", "true");
                    $('#tabs li[aria-controls="tab-relative-apps"] .tab-control').removeClass("highlight_blinker")
                })
            }
            function r(e) {
                var t = e.lp + "?utm_campaign=Extensions&utm_medium=relative&utm_source=" + chrome.runtime.id;
                var a = '<img src="' + (e.art || chrome.extension.getURL("/start/skin/images/extension_grey.png")) + '" />';
                var o = "<p>" + e.name + "</p>";
                if (e.lp) {
                    a = '<a href="' + t + '" target="_blank">' + a + "</a>";
                    o = '<p><a href="' + t + '" target="_blank">' + e.name + "</a></p>"
                }
                var i = e.enabled ? '<label><input type="checkbox" class="enableAppAction" data-extId="' + e.id + '" data-enabled="true" checked ><span class="enable">Enable</span><span class="enabled"><strong>Enabled</strong></span>' : '<label><input type="checkbox" class="enableAppAction" data-extId="' + e.id + '" data-enabled="false"><span class="enable">Enable</span><span class="enabled"><strong>Enabled</strong></span></label>';
                var l = "" + e.id !== "undefined" ? '<button class="installAppAction r-a-f"  data-extId="' + e.id + '">Install</button>' : "";
                var s = e.hl === "new" ? '<div class="r-h-n r-n"></div>' : e.hl === "hot" ? '<div class="r-h-n r-h"></div>' : "";
                var r = '<tr class="r-a-r-i">' + '<td class="r-a-c r-a-c-1">' + s + a + "</td>" + '<td class="r-a-c r-a-c-2">' + o + "</td>" + '<td class="r-a-c r-a-c-3">' + (e.installed ? i : l) + "</td>" + "</tr>";
                $("#tab-relative-apps table").append(r)
            }
            function n() {
                utils.getInstalledAppsInWhitelist(s, function(e) {
                    var t = []
                      , a = []
                      , l = []
                      , n = [];
                    for (var c = 0; c < s.length; c++) {
                        var g = {
                            id: s[c].id,
                            name: s[c].name,
                            art: s[c].art,
                            lp: s[c].lp,
                            hl: s[c].hl
                        };
                        var d = e.find(function(e) {
                            return g.id == e.id
                        });
                        if (d) {
                            g.installed = true;
                            g.enabled = d.enabled;
                            t.push(g)
                        } else {
                            g.installed = false;
                            if (g.hl == "hot")
                                a.push(g);
                            else if (g.hl == "new")
                                l.push(g);
                            else
                                n.push(g)
                        }
                    }
                    function f(e) {
                        e.forEach(function(e) {
                            r(e)
                        })
                    }
                    if (o && i) {
                        f(a);
                        f(l);
                        f(t);
                        f(n)
                    } else if (o && !i) {
                        f(a);
                        f(t);
                        f(l);
                        f(n)
                    } else if (!o && i) {
                        f(l);
                        f(t);
                        f(a);
                        f(n)
                    } else {
                        f(t);
                        f(a);
                        f(l);
                        f(n)
                    }
                })
            }
            n();
            e.relativeAppsFeatures.init();
            $('[data-toggle="tooltip"]').tooltip()
        }
        ;
        function o() {
            var e = [];
            if (localStorage.getItem("images")) {
                e = JSON.parse(localStorage.getItem("images"));
                var t = false;
                for (index = 0; index < e.length; index++) {
                    var a = e[index];
                    if (a.name === chosenRandomBG) {
                        $("#bg_name").text(a.imageName);
                        t = true;
                        if (a.imageText) {
                            if ($("#image_detail").length <= 0) {
                                var o = '<div id="image_detail" style="display: none;"><div id="image_name">' + a.imageName + '</div><div id="image_description">' + a.imageText + "</div></div>";
                                $("body").append(o)
                            } else {
                                $("#image_name").text(a.imageName);
                                $("#image_description").text(a.imageText)
                            }
                        }
                    }
                }
                if (!t) {
                    $("#bg_name").off("mouseover");
                    $("#bg_name").text("");
                    if ($("#image_detail").length > 0) {
                        $("#image_detail").remove()
                    }
                } else if ($("#bg_name").text().toLowerCase() === $("#image_name").text().toLowerCase()) {
                    $("#bg_name").off("mouseover").on("mouseover", function() {
                        if ($("#image_detail").length > 0) {
                            $("#wrapper").fadeOut("slow");
                            $(".top_gradient").fadeOut("slow");
                            $(".bottom_gradient").fadeOut("slow");
                            if (localStorage.getItem("enable_countdown") === "yes") {
                                $("#countdown").fadeOut("slow")
                            }
                            $("#image_detail").off("mouseleave").on("mouseleave", function() {
                                $("#wrapper").fadeIn();
                                $(".top_gradient").fadeIn();
                                $(".bottom_gradient").fadeIn();
                                $("#image_detail").fadeOut("slow");
                                if (localStorage.getItem("enable_countdown") === "yes") {
                                    $("#countdown").fadeIn()
                                }
                            });
                            $("#image_detail").fadeIn()
                        }
                    })
                } else {
                    $("#bg_name").off("mouseover");
                    if ($("#image_detail").length > 0) {
                        $("#image_detail").remove()
                    }
                }
            }
        }
        $(document).ready(function() {
            a();
            if (!localStorage.getItem("weather_location") || localStorage.getItem("weather_location_isvalid") === "false") {
                if (localStorage.getItem("disable_weather") === "no")
                    $("#error_box").show()
            } else {
                $("#error_box").hide()
            }
            $(".nav_menu a[class*=lnk_], #tab-setting a[class*=lnk_]").each(function(e, t) {
                t.protocol = "http:";
                t.host = user["firstRunDomain"]
            });
            function t() {
                $(".nav_menu").css("max-height", document.body.clientHeight - 80 + "px")
            }
            t();
            e.addEventListener("resize", t);
            function o(e) {
                var t = 0;
                for (var a = 0; a < e.length; a++) {
                    t += e[a].weight
                }
                var o = Math.floor(Math.random() * t);
                for (var i = 0, a = 0; a < e.length; a++) {
                    i += e[a].weight;
                    if (o <= i) {
                        return e[a].item
                    }
                }
            }
            var l = function(e) {
                var t = $("<div/>").html(e).contents();
                if (t.attr("track")) {
                    t.off("click");
                    t.on("click", function() {
                        if ($(this).attr("onetime")) {
                            localStorage.setItem("onetime_clicked", localStorage.getItem("onetime_clicked") + "," + $(this).attr("track"))
                        }
                        if ($(this).attr("highlight")) {
                            $(this).attr("class", ($(this).attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
                            localStorage.setItem("highlight_clicked", localStorage.getItem("highlight_clicked") + "," + $(this).attr("track"))
                        }
                        chrome.runtime.sendMessage("click-" + $(this).attr("track"))
                    })
                }
                if (t.attr("highlight") && (localStorage.getItem("highlight_clicked") + "").indexOf(t.attr("track")) == -1) {
                    t.addClass(localStorage.getItem("highlight") || "highlight")
                }
                if (!t.attr("onetime") || (localStorage.getItem("onetime_clicked") + "").indexOf(t.attr("track")) == -1) {
                    if (t.attr("showrate")) {
                        var a = parseFloat(t.attr("showrate"));
                        if (a > 0 && a < 1)
                            a = a * 100;
                        if (Math.floor(Math.random() * 100) <= a) {
                            $("nav").append(t)
                        }
                    } else {
                        $("nav").append(t)
                    }
                }
            };
            try {
                var s = null;
                if (user["geodata"])
                    s = JSON.parse(user["geodata"]);
                var r = function(e) {
                    var t = $("<div/>").html(e).contents();
                    if (t.attr("track")) {
                        t.off("click");
                        t.on("click", function() {
                            if ($(this).attr("onetime")) {
                                localStorage.setItem("onetime_clicked", localStorage.getItem("onetime_clicked") + "," + $(this).attr("track"))
                            }
                            if ($(this).attr("highlight")) {
                                $(this).attr("class", ($(this).attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
                                localStorage.setItem("highlight_clicked", localStorage.getItem("highlight_clicked") + "," + $(this).attr("track"))
                            }
                            chrome.runtime.sendMessage("click-" + $(this).attr("track"))
                        })
                    }
                    if (t.attr("highlight") && (localStorage.getItem("highlight_clicked") + "").indexOf(t.attr("track")) == -1) {
                        t.addClass(localStorage.getItem("highlight") || "highlight")
                    }
                    if (!t.attr("onetime") || (localStorage.getItem("onetime_clicked") + "").indexOf(t.attr("track")) == -1) {
                        if (t.attr("showrate")) {
                            var a = parseFloat(t.attr("showrate"));
                            if (a > 0 && a < 1)
                                a = a * 100;
                            if (Math.floor(Math.random() * 100) <= a) {
                                $(".quote").append(t)
                            }
                        } else {
                            $(".quote").append(t)
                        }
                    }
                };
                var n = false;
                if (s && typeof s["intro"] !== "undefined") {
                    var c = s["intro"];
                    for (var g = 0; g < Object.keys(c).length; g++) {
                        if (Object.keys(c)[g].indexOf(e.chosenRandomBG) > -1) {
                            n = true;
                            r(Object.values(c)[g]);
                            break
                        }
                    }
                }
                if (s && typeof s["quotes"] !== "undefined" && !n) {
                    var d = s["quotes"];
                    if (typeof d == "string" && d) {
                        r(d)
                    } else if (d.length && typeof d[0] == "string") {
                        var f = [];
                        for (var g = 0; g < d.length; g++) {
                            var h = 1;
                            var m = d[g].match(/ data-w="([0-9]+)"/);
                            if (m && m.length >= 2)
                                h = parseInt(m[1]);
                            f.push({
                                item: d[g],
                                weight: h
                            })
                        }
                        r(o(f))
                    }
                }
            } catch (t) {
                if (e.debug)
                    console.log("Error parse geodata for quote.");
                chrome.runtime.sendMessage({
                    error: "error-geodata-quote",
                    detail: t.message
                })
            }
            try {
                if (s && typeof s["nav"] !== "undefined") {
                    var u = s["nav"];
                    if (typeof u == "string" && u) {
                        l(u)
                    } else if (u.length && typeof u[0] == "string") {
                        var p = []
                          , _ = [];
                        for (var g = 0; g < u.length; g++) {
                            var h = 1;
                            var m = u[g].match(/ data-w="([0-9]+)"/);
                            if (m && m.length >= 2)
                                h = parseInt(m[1]);
                            if (u[g].indexOf("NavRelateExt") > -1) {
                                p.push({
                                    item: u[g],
                                    weight: h
                                })
                            } else {
                                _.push({
                                    item: u[g],
                                    weight: h
                                })
                            }
                        }
                        if (_.length)
                            l(o(_));
                        if (p.length)
                            l(o(p))
                    }
                }
            } catch (t) {
                if (e.debug)
                    console.log("Error parse geodata for nav.");
                chrome.runtime.sendMessage({
                    error: "error-geodata-nav",
                    detail: t.message
                })
            }
            $("#shuffle_background").off("change");
            if (localStorage.getItem("shuffle_background") == "yes") {
                $("#shuffle_background").prop("checked", true);
                $("#shuffle_favorites").prop("checked", false)
            } else {
                $("#shuffle_background").prop("checked", false)
            }
            $("#shuffle_background").on("change", function() {
                if ($("#shuffle_background").is(":checked")) {
                    localStorage.setItem("shuffle_background", "yes");
                    $("#shuffle_favorites").prop("checked", false);
                    localStorage.setItem("shuffle_favorites", "no")
                } else {
                    localStorage.setItem("shuffle_background", "no")
                }
                localStorage.setItem("backgroundLoaded", JSON.stringify([]));
                utils.storageSync()
            });
            $("#shuffle_favorites").off("change");
            if (localStorage.getItem("shuffle_favorites") == "yes") {
                $("#shuffle_favorites").prop("checked", true);
                $("#shuffle_background").prop("checked", false)
            } else {
                $("#shuffle_favorites").prop("checked", false)
            }
            $("#shuffle_favorites").on("change", function() {
                if ($("#shuffle_favorites").is(":checked")) {
                    localStorage.setItem("shuffle_favorites", "yes");
                    $("#shuffle_background").prop("checked", false);
                    localStorage.setItem("shuffle_background", "no")
                } else {
                    localStorage.setItem("shuffle_favorites", "no")
                }
                localStorage.setItem("backgroundLoaded", JSON.stringify([]));
                utils.storageSync()
            });
            $("#favor_new_images").off("change");
            if (localStorage.getItem("favor_new_images") == "yes") {
                $("#favor_new_images").prop("checked", true)
            } else {
                $("#favor_new_images").prop("checked", false)
            }
            $("#favor_new_images").on("change", function() {
                if ($("#favor_new_images").is(":checked")) {
                    localStorage.setItem("favor_new_images", "yes")
                } else {
                    localStorage.setItem("favor_new_images", "no")
                }
                utils.storageSync()
            });
            $("#favor_all_images").off("change");
            $("#favor_all_images").prop("checked", false);
            if (localStorage.getItem("mark_favor")) {
                var v = JSON.parse(localStorage.getItem("mark_favor"));
                if (v.length === user["bg_img_list"]) {
                    $("#favor_all_images").prop("checked", true)
                }
            }
            $("#favor_all_images").on("change", function() {
                if ($("#favor_all_images").is(":checked")) {
                    var e = [];
                    for (var t = 1; t <= user["bg_img_list"]; t++) {
                        e.push(t + "");
                        var a = $(`#images_selector span.mark_favor[favor-for="${t}"]`);
                        a.addClass("marked_favor");
                        a.attr("data-toggle", "tooltip");
                        a.attr("data-placement", "bottom");
                        a.attr("data-original-title", "Remove this image from favorites");
                        a.tooltip();
                        a.find(".glyphicon").removeClass("glyphicon-heart-empty");
                        a.find(".glyphicon").addClass("glyphicon-heart")
                    }
                    localStorage.setItem("mark_favor", JSON.stringify(e))
                } else {
                    var o = JSON.parse(localStorage.getItem("mark_favor"));
                    if (o.length === user["bg_img_list"]) {
                        for (var t = 1; t <= user["bg_img_list"]; t++) {
                            var a = $(`#images_selector span.mark_favor[favor-for="${t}"]`);
                            a.removeClass("marked_favor");
                            a.attr("data-toggle", "tooltip");
                            a.attr("data-placement", "bottom");
                            a.attr("data-original-title", "Mark this image as favorite");
                            a.tooltip();
                            a.find(".glyphicon").removeClass("glyphicon-heart");
                            a.find(".glyphicon").addClass("glyphicon-heart-empty")
                        }
                        localStorage.setItem("mark_favor", JSON.stringify([]))
                    }
                }
                utils.storageSync()
            });
            e.loadGlobalOptions = function() {
                e.loadToDoList();
                e.loadCountDownModule(e);
                e.loadAutoHideModule(e);
                e.loadSnowModule(e);
                e.loadSetTimeModule(e);
                e.loadBackgroundAnimations();
                if (user["time_format"]) {
                    $("#time_format").val(user["time_format"])
                }
                if (user["date_format"]) {
                    $("#date_format").val(user["date_format"])
                }
                if (user["units_weather"]) {
                    $("#units_weather").val(user["units_weather"])
                }
                if (localStorage.getItem("countdown_background") === "yes") {
                    $("ul#countdown").css({
                        background: "radial-gradient(rgba(0,0,0,0.9)-4%, rgba(0,0,0,0)68%)"
                    })
                } else {
                    $("ul#countdown").css({
                        background: "transparent"
                    })
                }
                if (localStorage.getItem("countdown_text_color")) {
                    $("ul#countdown li,ul#countdown .title").css({
                        color: localStorage.getItem("countdown_text_color")
                    });
                    $("#countdown_text_color").val(localStorage.getItem("countdown_text_color"))
                }
                $("#countdown_text_color").off("change").on("change", function() {
                    $("ul#countdown li,ul#countdown .title").css({
                        transition: "all 0.5s, opacity 0s, color 0.32s",
                        color: $(this).val()
                    });
                    localStorage.setItem("countdown_text_color", $(this).val());
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    })
                });
                $("#random_all_newtab").prop("checked", localStorage.getItem("random_all_newtab") === "yes");
                $("#random_all_newtab").off("change");
                $("#random_all_newtab").on("change", function() {
                    localStorage.setItem("random_all_newtab", $("#random_all_newtab").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });
                $("#disable_weather").prop("checked", localStorage.getItem("disable_weather") === "yes");
                $("#disable_weather").off("change");
                $("#disable_weather").on("change", function() {
                    if ($("#disable_weather").is(":checked")) {
                        $("#error_box").hide()
                    } else {
                        if (localStorage.getItem("weather_location_isvalid") === "false") {
                            if (localStorage.getItem("disable_weather") === "no")
                                $("#error_box").show()
                        }
                    }
                    localStorage.setItem("disable_weather", $("#disable_weather").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });
                if (localStorage.getItem("enable_most_visited") == "no") {
                    $(".most_visited").hide()
                } else {
                    $(".most_visited").show()
                }
                $("#enable_most_visited").prop("checked", localStorage.getItem("enable_most_visited") === "yes");
                $("#enable_most_visited").off("change");
                $("#enable_most_visited").on("change", function() {
                    if (!$("#enable_most_visited").is(":checked")) {
                        $(".most_visited").fadeOut()
                    } else {
                        $(".most_visited").fadeIn()
                    }
                    localStorage.setItem("enable_most_visited", $("#enable_most_visited").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });
                if (localStorage.getItem("enable_apps") == "no") {
                    $(".apps").fadeOut()
                } else {
                    $(".apps").fadeIn()
                }
                $("#enable_apps").prop("checked", localStorage.getItem("enable_apps") === "yes");
                $("#enable_apps").off("change");
                $("#enable_apps").on("change", function() {
                    if (!$("#enable_apps").is(":checked")) {
                        $(".apps").fadeOut()
                    } else {
                        $(".apps").fadeIn()
                    }
                    localStorage.setItem("enable_apps", $("#enable_apps").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });

            //quick access dropdown toggle
                if (localStorage.getItem("enable_quick_access") == "no") {
                    $(".quick_access").fadeOut()
                } else {
                    $(".quick_access").fadeIn()
                }
                $("#enable_quick_access").prop("checked", localStorage.getItem("enable_quick_access") === "yes");
                $("#enable_quick_access").off("change");
                $("#enable_quick_access").on("change", function() {
                    if (!$("#enable_quick_access").is(":checked")) {
                        $(".quick_access").fadeOut()
                    } else {
                        $(".quick_access").fadeIn()
                    }
                    localStorage.setItem("enable_quick_access", $("#enable_quick_access").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });

            //weather wodget dropdown toggle
                if (localStorage.getItem("enable_weather") == "no") {
                    $("#myWeather").fadeOut(function() {
                        removeTransformCSS();
                    });
                } else {
                    $("#myWeather").fadeIn()
                }
                $("#enable_weather").prop("checked", localStorage.getItem("enable_weather") === "yes");
                $("#enable_weather").off("change");
                $("#enable_weather").on("change", function() {
                    if (!$("#enable_weather").is(":checked")) {
                        $("#myWeather").fadeOut(function() {
                            removeTransformCSS();
                        });
                    } else {
                        enableWeatherDelay();
                        
                    }
                    localStorage.setItem("enable_weather", $("#enable_weather").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });

                function enableWeatherDelay() {
                    addTransformCSS();
                    setTimeout(function() {
                        $("#myWeather").fadeIn();
                    }, 300); // 1000 milliseconds = 1 second
                }

                //shift the widghtto the right when weather is disabled by editing the css in index.html
                function removeTransformCSS() {
                    var styleSheets = document.styleSheets;
                    for (var i = 0; i < styleSheets.length; i++) {
                        var rules = styleSheets[i].cssRules || styleSheets[i].rules;
                        for (var j = 0; j < rules.length; j++) {
                            var rule = rules[j];
                            if (rule.selectorText === ".widght" && rule.style.transform === "translateX(-70%)") {
                                styleSheets[i].deleteRule(j);
                                return; // Exit once the rule is found and removed
                            }
                        }
                    }
                }

                //shift the widgh to the left when weather is enabled by editing the css in index.html
                function addTransformCSS() {
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.id = 'widght-transform-style';
                    style.innerHTML = '.widght { transform: translateX(-70%); }';
                    document.getElementsByTagName('head')[0].appendChild(style);
                }
                
                
                

                $("#enable_shortcuts").prop("checked", localStorage.getItem("enable_shortcuts") === "yes");
                $("#enable_shortcuts").off("change");
                $("#enable_shortcuts").on("change", function() {
                    if (!$("#enable_shortcuts").is(":checked")) {
                        $(".shortcuts").fadeOut()
                    } else {
                        $(".shortcuts").fadeIn()
                    }
                    localStorage.setItem("enable_shortcuts", $("#enable_shortcuts").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });
                $("#enable_share").prop("checked", localStorage.getItem("enable_share") === "yes");
                $("#enable_share").off("change");
                $("#enable_share").on("change", function() {
                    if (!$("#enable_share").is(":checked")) {
                        $(".share").fadeOut()
                    } else {
                        $(".share").fadeIn()
                    }
                    localStorage.setItem("enable_share", $("#enable_share").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });
                if (localStorage.getItem("enable_slideshow") == "no") {
                    i.disable()
                } else {
                    i.enable()
                }
                $("#enable_slideshow").prop("checked", localStorage.getItem("enable_slideshow") === "yes");
                $("#enable_slideshow").off("change");
                $("#enable_slideshow").on("change", function() {
                    if (!$("#enable_slideshow").is(":checked")) {
                        i.disable()
                    } else {
                        var e = [];
                        if (localStorage.getItem("mark_favor"))
                            e = JSON.parse(localStorage.getItem("mark_favor"));
                        if (localStorage.getItem("shuffle_background") == "no" && (localStorage.getItem("shuffle_favorites") == "no" || localStorage.getItem("shuffle_favorites") == "yes" && e.length <= 1)) {
                            localStorage.setItem("shuffle_background", "yes");
                            localStorage.setItem("shuffle_favorites", "no");
                            $("#shuffle_background").prop("checked", true);
                            $("#shuffle_favorites").prop("checked", false)
                        }
                        localStorage.setItem("last_time_do_slide", Number(new Date));
                        i.enable()
                    }
                    localStorage.setItem("enable_slideshow", $("#enable_slideshow").is(":checked") ? "yes" : "no");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });
                $("#delete_button").off("click");
                $("#delete_button").on("click", function() {
                    $("#error_box").hide();
                    $("#disable_weather").prop("checked", true);
                    localStorage.setItem("disable_weather", "yes");
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    });
                    utils.storageSync()
                });
                $('[data-toggle="tooltip"]').tooltip()
            }
            ;
            e.loadGlobalOptions();
            e.loadImagesInOption = function() {
                var t = 5;
                for (var a = 1; a <= user["bg_img_list"]; a++) {
                    var o = "bg-" + (a < 100 ? ("0" + a).slice(-2) : a);
                    var i = $("<li>");
                    var l;
                    var s;
                    if (Object.keys(user["bg_color_gif"]).indexOf(o + ".gif") > -1) {
                        s = o + ".gif";
                        l = $("<img>", {
                            "data-src": s,
                            src: utils.getExtensionURL("/start/skin/images/" + o + ".gif")
                        })
                    } else {
                        s = o + ".jpg";
                        l = $("<img>", {
                            "data-src": s,
                            src: utils.getExtensionURL("/start/skin/images/" + o + ".jpg")
                        })
                    }
                    i.append(l);
                    var r = '<div class="like-container" style="display: none;"><div class="like-action" data-src="' + s + '"></div><span class="like-label"></span></div>';
                    i.append(r);
                    $("#images_selector").append(i);
                    var n, c = [];
                    if (localStorage.getItem("mark_favor"))
                        c = JSON.parse(localStorage.getItem("mark_favor"));
                    if (c.indexOf(a + "") > -1) {
                        n = $('<span class="mark_favor marked_favor" favor-for="' + a + '" data-toggle="tooltip" data-placement="bottom" title="Remove this image from favorites"><span class="glyphicon glyphicon-heart"></span></span>')
                    } else {
                        n = $('<span class="mark_favor" favor-for="' + a + '" data-toggle="tooltip" data-placement="bottom" title="Mark this image as favorite"><span class="glyphicon glyphicon-heart-empty"></span></span>')
                    }
                    utils.resetClickHandler(n, function() {
                        var e = $(this).attr("favor-for");
                        var t = [];
                        if (localStorage.getItem("mark_favor"))
                            t = JSON.parse(localStorage.getItem("mark_favor"));
                        $(this).toggleClass("marked_favor");
                        if ($(this).hasClass("marked_favor")) {
                            $(this).attr("data-toggle", "tooltip");
                            $(this).attr("data-placement", "bottom");
                            $(this).attr("data-original-title", "Remove this image from favorites");
                            $(this).tooltip();
                            $(this).find(".glyphicon").removeClass("glyphicon-heart-empty");
                            $(this).find(".glyphicon").addClass("glyphicon-heart");
                            if (t.indexOf(e + "") == -1) {
                                t.push(e + "")
                            }
                            if (t.length === user["bg_img_list"])
                                $("#favor_all_images").prop("checked", true)
                        } else {
                            $(this).attr("data-toggle", "tooltip");
                            $(this).attr("data-placement", "bottom");
                            $(this).attr("data-original-title", "Mark this image as favorite");
                            $(this).tooltip();
                            $(this).find(".glyphicon").removeClass("glyphicon-heart");
                            $(this).find(".glyphicon").addClass("glyphicon-heart-empty");
                            if (t.indexOf(e + "") > -1) {
                                t.splice(t.indexOf(e + ""), 1)
                            }
                            $("#favor_all_images").prop("checked", false)
                        }
                        localStorage.setItem("mark_favor", JSON.stringify(t));
                        utils.storageSync()
                    });
                    $("#images_selector").append(n);
                    if (a % t == 0) {
                        $("#images_selector").append($("<br>"))
                    }
                }
                $("#images_selector li").each(function() {
                    if (($(this).find("img").attr("src") + "").indexOf(e.chosenRandomBG) > -1) {
                        $(this).addClass("selected")
                    }
                });
                String.prototype.toShortNumber = function() {
                    var e = this.toString();
                    var t = Number(e);
                    if (!t || t === NaN) {
                        var a = e.match(/\d+/g).toString();
                        t = Number(a)
                    }
                    var o;
                    if (t >= 1e9) {
                        o = (Math.round(t / 1e7) / 100).toString() + "B"
                    } else if (t >= 1e6) {
                        o = (Math.round(t / 1e4) / 100).toString() + "M"
                    } else if (t >= 1e3) {
                        o = (Math.round(t / 10) / 100).toString() + "K"
                    } else if (t < 1e3) {
                        return t.toString()
                    }
                    return o
                }
                ;
                $("#close_background_selector_widget").off("click");
                $("#close_background_selector_widget").on("click", function(e) {
                    $("#background_selector_widget").fadeOut()
                });
                $("#background_selector_widget").off("click");
                $("#background_selector_widget").on("click", function(e) {
                    e.stopPropagation()
                });
                $("#images_selector li .like-container").off("click");
                $("#images_selector li .like-container").on("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation()
                });
                var g = [];
                $("#images_selector li .like-action").off("click");
                $("#images_selector li .like-action").on("click", function(t) {
                    t.preventDefault();
                    t.stopPropagation();
                    var a = $(this).parent("div");
                    var o = a.find(".like-label");
                    var i = $(this).data("src");
                    var l = $(this).data("id");
                    if (!l)
                        return;
                    var s = 0;
                    var r = parseInt(o.text());
                    $(this).toggleClass("active");
                    $(this).parent().removeClass().addClass("like-container clicked").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                        $(this).removeClass().addClass("like-container")
                    });
                    function n(t) {
                        var a = localStorage.getItem("likedImages");
                        if (!a && !g.length) {
                            g.slice(0, g.length);
                            g.push(i);
                            localStorage.setItem("likedImages", JSON.stringify(g))
                        } else {
                            try {
                                g = JSON.parse(localStorage.getItem("likedImages"));
                                var o = g.find(function(e) {
                                    return e === i
                                });
                                if (t && !o) {
                                    g.push(i)
                                } else {
                                    g.splice(g.indexOf(i), 1)
                                }
                                localStorage.setItem("likedImages", JSON.stringify(g))
                            } catch (t) {
                                if (e.debug)
                                    console.log(t)
                            }
                        }
                    }
                    if ($(this).hasClass("active")) {
                        r++;
                        s = 1;
                        n(true)
                    } else {
                        r--;
                        s = -1;
                        n(false)
                    }
                });
                $("#background_selector_widget #tab-background li").off("click");
                $("#background_selector_widget #tab-background li").on("click", function(t) {
                    t.preventDefault();
                    t.stopPropagation();
                    var a = $(this).parent("ul");
                    a.find(".like-container").fadeOut();
                    $("#background_selector_widget li.selected").removeClass();
                    $(this).addClass("selected");
                    var o = $(this).find(".like-container");
                    o.fadeIn("slow");
                    if ($(this).find("img").length > 0) {
                        var i = $(this).find("img").attr("data-src");
                        user["bg_img"] = i;
                        user["bg_color"] = "";
                        e.setBackgroundGIFOrJPG(i)
                    } else if ($(this).attr("cl")) {
                        var l = $(this).attr("cl");
                        $("body").css({
                            "background-image": "none",
                            background: "#" + l
                        });
                        user["bg_img"] = "none";
                        user["bg_color"] = "#" + l
                    }
                    utils.storageSync()
                });
                $('[data-toggle="tooltip"]').tooltip()
            }
            ;
            chrome.runtime.sendMessage({
                rateStatus: true
            }, function(e) {
                if (e === -1) {
                    $("#click-Rate").hide()
                }
                if (e === 0) {
                    $("#click-Rate").show()
                }
                if (e === 1) {
                    $("#click-Rate").addClass(localStorage.getItem("highlight") || "highlight");
                    $("#click-Rate").show()
                }
            });
            if (e.debug) {
                utils.resetClickHandler($("#click-Rate"), function() {
                    chrome.windows.getAll(function(e) {
                        console.log("WIN.getAll: ", e);
                        for (var t = 0; t < e.length; t++) {
                            if (e[t].id !== -1)
                                chrome.windows.update(e[t].id, {
                                    focused: true,
                                    left: 0,
                                    top: 0,
                                    width: 1280,
                                    height: 800
                                })
                        }
                    })
                })
            } else {
                utils.resetClickHandler($("#click-Rate"), function() {
                    $("#click-Rate").attr("class", ($("#click-Rate").attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
                    localStorage.setItem("rate_clicked", "yes");
                    utils.storageSync();
                    swal({
                        title: "Does this extension deserve 5/5 stars rating ?",
                        text: "",
                        type: "success",
                        html: true,
                        animation: false,
                        showConfirmButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, rate it 5 stars",
                        showCancelButton: true,
                        cancelButtonText: "No, I have feedback",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    }, function(e) {
                        if (e) {
                            $("#click-Rate").hide();
                            localStorage.setItem("rate_clicked", "cws");
                            chrome.runtime.sendMessage("click-Rate")
                        } else {
                            localStorage.setItem("rate_clicked", "feedback");
                            chrome.runtime.sendMessage("click-Feedback")
                        }
                        utils.storageSync()
                    })
                })
            }
            utils.resetClickHandler($("a[class*=lnk_update_]"), function() {
                chrome.runtime.sendMessage("click-UpdateHistory")
            });
            utils.resetClickHandler($(".lnk_chromethemes"), function() {
                chrome.runtime.sendMessage("click-ChromeThemes")
            });
            utils.resetClickHandler($(""), function() {
                chrome.runtime.sendMessage("click-Bookmarks")
            });
            utils.resetClickHandler($(".lnk_faq"), function() {
                chrome.runtime.sendMessage("click-FAQ")
            });
            utils.resetClickHandler($(".lnk_eula"), function() {
                chrome.runtime.sendMessage("click-EULA")
            });
            utils.resetClickHandler($(".lnk_privacy"), function() {
                chrome.runtime.sendMessage("click-Privacy")
            });
            utils.resetClickHandler($(".uninstallSelf"), function() {
                chrome.runtime.sendMessage("click-Uninstall")
            });
            utils.resetClickHandler($(".click-Donate"), function() {
                chrome.runtime.sendMessage("click-Donate")
            });
            utils.resetClickHandler($(".click-Feedback"), function() {
                chrome.runtime.sendMessage("click-Feedback")
            });
            utils.resetClickHandler($(".click-ShareFB"), function() {
                chrome.runtime.sendMessage("click-ShareFB")
            });
            utils.resetClickHandler($(".click-ShareTW"), function() {
                chrome.runtime.sendMessage("click-ShareTW")
            });
            utils.resetClickHandler($(".click-SharePI"), function() {
                chrome.runtime.sendMessage("click-SharePI")
            });
            utils.resetClickHandler($(".click-ShareTU"), function() {
                chrome.runtime.sendMessage("click-ShareTU")
            });
            utils.resetClickHandler($(".click-ShareVK"), function() {
                chrome.runtime.sendMessage("click-ShareVK")
            });
            utils.resetClickHandler($(".click-Export"), function() {
                chrome.runtime.sendMessage("click-Export")
            });
            utils.resetClickHandler($(".click-Import"), function() {
                chrome.runtime.sendMessage("click-Import");
                swal({
                    title: "Import Settings",
                    text: '<p>If you have exported Settings that you would like to import, please paste the saved text in the following box and click "Import Now".</p><p><textarea id="import-options" style="width:90%;height:150px;font-size:smaller;border:solid 1px;"></textarea></p>',
                    type: "success",
                    html: true,
                    animation: false,
                    showConfirmButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Import Now",
                    showCancelButton: true,
                    cancelButtonText: "Cancel",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function(t) {
                    if (t) {
                        try {
                            var a = JSON.parse($("#import-options").val());
                            if (a) {
                                if (e.debug)
                                    console.log("set options:", a);
                                chrome.runtime.sendMessage({
                                    changeOptions: a
                                })
                            }
                        } catch (t) {
                            if (e.debug)
                                console.log("set options error:", t)
                        }
                    }
                })
            });
            utils.resetClickHandler($("#tool_menu a"), function() {
                if ($(this).attr("id") == "mail-address-shower")
                    return;
                chrome.runtime.sendMessage({
                    name: "click-Apps",
                    data: $(this).text().replace(/[ ]*\([0-9]+\)[ ]*$/, "")
                })
            });
            $('[data-toggle="tooltip"]').tooltip()
        });
        e.loadBackgroundAnimations = function() {
            function t(e, t, a, o) {
                var i = document.createElement("option");
                i.value = t;
                i.textContent = a;
                o === t && i.setAttribute("selected", "selected");
                e.appendChild(i)
            }
            var a = $("#bg_animations");
            var o = localStorage.getItem("bg_animation");
            a.empty();
            t(a.get(0), "random", "Random", o);
            animations.forEach(function(e) {
                t(a.get(0), e.value, e.text, o)
            });
            a.off("change");
            a.on("change", function(t) {
                t.preventDefault();
                localStorage.setItem("bg_animation", t.target.value);
                chrome.runtime.sendMessage({
                    syncOptionsNow: true
                });
                e.setNewTabBackground()
            })
        }
        ;
        e.addEventListener("load", function() {
            $("#wrapper").fadeIn(100, function() {
                if (localStorage.getItem("theme_clicked") !== "yes") {
                    $("#background_selector_menu").css("font-family", "'neue-bold'");
                    $("#background_selector_menu").addClass(localStorage.getItem("highlight") || "highlight")
                }
                var a = function() {
                    $("#background_selector_menu").css("font-family", "'neue',Helvetica,Arial,sans-serif");
                    $("#background_selector_menu").attr("class", ($("#background_selector_menu").attr("class") || "").replace(/highlight[a-z_-]*[ ]*/gi, ""));
                    localStorage.setItem("theme_clicked", "yes");
                    utils.storageSync()
                };
                utils.resetClickHandler($("#background_selector_menu"), function(o) {
                    o.preventDefault();
                    o.stopPropagation();
                    $("#background_selector_widget").fadeIn();
                    chrome.runtime.sendMessage("click-ChangeThemeMenu");
                    a();
                    if (!t) {
                        t = true;
                        e.loadImagesInOption();
                        e.loadRelativeApps()
                    }
                });
                $("#search-input").focus();
                $("#search-input").click()
            })
        });
        var i = {
            thread: null,
            timer: 10,
            enable: function() {
                $("#selectTimer").parent().fadeIn();
                var t = this;
                if (localStorage.getItem("slideshow_timer")) {
                    t.timer = localStorage.getItem("slideshow_timer");
                    $("#selectTimer select").val(t.timer)
                }
                $("#selectTimer select").off("change");
                $("#selectTimer select").on("change", function() {
                    t.timer = parseInt($(this).val());
                    localStorage.setItem("slideshow_timer", t.timer)
                });
                function a() {
                    var a = (new Date).getTime();
                    var o = 0;
                    if (localStorage.getItem("last_time_do_slide")) {
                        o = parseInt(localStorage.getItem("last_time_do_slide"))
                    }
                    if (a - o >= t.timer * 1e3) {
                        e.setNewTabBackground();
                        localStorage.setItem("last_time_do_slide", a)
                    }
                }
                if (e.listAllThreads.threadSlideshow) {
                    e.listAllThreads.threadSlideshow.pause()
                }
                e.listAllThreads.threadSlideshow = {
                    pause: function() {
                        clearInterval(t.thread)
                    },
                    resume: function() {
                        a();
                        if (t.thread) {
                            clearInterval(t.thread);
                            t.thread = null
                        }
                        t.thread = setInterval(a, 999)
                    }
                };
                e.listAllThreads.threadSlideshow.resume()
            },
            disable: function() {
                $("#selectTimer").parent().fadeOut();
                clearInterval(this.thread);
                this.thread = null;
                delete e.listAllThreads.threadSlideshow
            }
        }
    } catch (e) {
        console.log(e)
    }
}
)(this);
