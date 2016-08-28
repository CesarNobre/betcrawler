# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := protocol_sources
### Rules for action "generateV8InspectorProtocolBackendSources":
quiet_cmd__home_cesarnobre_Documents_betcrawler_Academia_tmp_nexe_nodejs_latest_node_v6_4_0_deps_v8_inspector_third_party_v8_inspector_platform_v8_inspector_v8_inspector_gyp_protocol_sources_target_generateV8InspectorProtocolBackendSources = ACTION Generating protocol backend sources from json definitions. $@
cmd__home_cesarnobre_Documents_betcrawler_Academia_tmp_nexe_nodejs_latest_node_v6_4_0_deps_v8_inspector_third_party_v8_inspector_platform_v8_inspector_v8_inspector_gyp_protocol_sources_target_generateV8InspectorProtocolBackendSources = LD_LIBRARY_PATH=$(builddir)/lib.host:$(builddir)/lib.target:$$LD_LIBRARY_PATH; export LD_LIBRARY_PATH; cd $(srcdir)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector; mkdir -p $(obj)/gen/blink/platform/v8_inspector/public/protocol $(obj)/gen/blink/platform/v8_inspector/protocol; python ../inspector_protocol/CodeGenerator.py --protocol js_protocol.json --string_type String16 --export_macro PLATFORM_EXPORT --output_dir "$(obj)/gen/blink/platform/v8_inspector/protocol" --output_package platform/v8_inspector/protocol --exported_dir "$(obj)/gen/blink/platform/v8_inspector/public/protocol" --exported_package platform/v8_inspector/public/protocol

$(obj)/gen/blink/platform/v8_inspector/protocol/Console.cpp: obj := $(abs_obj)
$(obj)/gen/blink/platform/v8_inspector/protocol/Console.cpp: builddir := $(abs_builddir)
$(obj)/gen/blink/platform/v8_inspector/protocol/Console.cpp: TOOLSET := $(TOOLSET)
$(obj)/gen/blink/platform/v8_inspector/protocol/Console.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Console.h $(obj)/gen/blink/platform/v8_inspector/protocol/Debugger.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Debugger.h $(obj)/gen/blink/platform/v8_inspector/protocol/HeapProfiler.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/HeapProfiler.h $(obj)/gen/blink/platform/v8_inspector/protocol/Profiler.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Profiler.h $(obj)/gen/blink/platform/v8_inspector/protocol/Runtime.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Runtime.h $(obj)/gen/blink/platform/v8_inspector/public/protocol/Runtime.h $(obj)/gen/blink/platform/v8_inspector/public/protocol/Debugger.h: b1138f0868a315f4e3ba1fe6766856c7b205a4bd.intermediate
	@:
.INTERMEDIATE: b1138f0868a315f4e3ba1fe6766856c7b205a4bd.intermediate
b1138f0868a315f4e3ba1fe6766856c7b205a4bd.intermediate: $(srcdir)/deps/v8_inspector/third_party/jinja2/jinja2/__init__.py $(srcdir)/deps/v8_inspector/third_party/markupsafe/markupsafe/__init__.py $(srcdir)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/CodeGenerator.py $(srcdir)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/TypeBuilder_h.template $(srcdir)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/TypeBuilder_cpp.template $(srcdir)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/Exported_h.template $(srcdir)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/Imported_h.template $(srcdir)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/js_protocol.json FORCE_DO_CMD
	$(call do_cmd,touch)
	$(call do_cmd,_home_cesarnobre_Documents_betcrawler_Academia_tmp_nexe_nodejs_latest_node_v6_4_0_deps_v8_inspector_third_party_v8_inspector_platform_v8_inspector_v8_inspector_gyp_protocol_sources_target_generateV8InspectorProtocolBackendSources)

all_deps += $(obj)/gen/blink/platform/v8_inspector/protocol/Console.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Console.h $(obj)/gen/blink/platform/v8_inspector/protocol/Debugger.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Debugger.h $(obj)/gen/blink/platform/v8_inspector/protocol/HeapProfiler.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/HeapProfiler.h $(obj)/gen/blink/platform/v8_inspector/protocol/Profiler.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Profiler.h $(obj)/gen/blink/platform/v8_inspector/protocol/Runtime.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Runtime.h $(obj)/gen/blink/platform/v8_inspector/public/protocol/Runtime.h $(obj)/gen/blink/platform/v8_inspector/public/protocol/Debugger.h
action__home_cesarnobre_Documents_betcrawler_Academia_tmp_nexe_nodejs_latest_node_v6_4_0_deps_v8_inspector_third_party_v8_inspector_platform_v8_inspector_v8_inspector_gyp_protocol_sources_target_generateV8InspectorProtocolBackendSources_outputs := $(obj)/gen/blink/platform/v8_inspector/protocol/Console.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Console.h $(obj)/gen/blink/platform/v8_inspector/protocol/Debugger.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Debugger.h $(obj)/gen/blink/platform/v8_inspector/protocol/HeapProfiler.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/HeapProfiler.h $(obj)/gen/blink/platform/v8_inspector/protocol/Profiler.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Profiler.h $(obj)/gen/blink/platform/v8_inspector/protocol/Runtime.cpp $(obj)/gen/blink/platform/v8_inspector/protocol/Runtime.h $(obj)/gen/blink/platform/v8_inspector/public/protocol/Runtime.h $(obj)/gen/blink/platform/v8_inspector/public/protocol/Debugger.h


### Rules for final target.
# Build our special outputs first.
$(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/protocol_sources.stamp: | $(action__home_cesarnobre_Documents_betcrawler_Academia_tmp_nexe_nodejs_latest_node_v6_4_0_deps_v8_inspector_third_party_v8_inspector_platform_v8_inspector_v8_inspector_gyp_protocol_sources_target_generateV8InspectorProtocolBackendSources_outputs)

# Preserve order dependency of special output on deps.
$(action__home_cesarnobre_Documents_betcrawler_Academia_tmp_nexe_nodejs_latest_node_v6_4_0_deps_v8_inspector_third_party_v8_inspector_platform_v8_inspector_v8_inspector_gyp_protocol_sources_target_generateV8InspectorProtocolBackendSources_outputs): | $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/protocol_version.stamp

$(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/protocol_sources.stamp: TOOLSET := $(TOOLSET)
$(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/protocol_sources.stamp: $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/protocol_version.stamp FORCE_DO_CMD
	$(call do_cmd,touch)

all_deps += $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/protocol_sources.stamp
# Add target alias
.PHONY: protocol_sources
protocol_sources: $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/protocol_sources.stamp

# Add target alias to "all" target.
.PHONY: all
all: protocol_sources

