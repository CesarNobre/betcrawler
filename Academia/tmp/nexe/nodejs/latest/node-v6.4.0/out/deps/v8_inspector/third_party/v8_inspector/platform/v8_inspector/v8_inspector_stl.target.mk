# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := v8_inspector_stl
DEFS_Debug := \
	'-DV8_INSPECTOR_USE_STL=1' \
	'-DDEBUG' \
	'-D_DEBUG'

# Flags passed to all source files.
CFLAGS_Debug := \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++0x

INCS_Debug := \
	-I$(srcdir)/deps/v8_inspector/third_party/v8_inspector \
	-I$(srcdir)/deps/v8/include \
	-I$(srcdir)/deps/v8 \
	-I$(obj)/gen/blink

DEFS_Release := \
	'-DV8_INSPECTOR_USE_STL=1'

# Flags passed to all source files.
CFLAGS_Release := \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-O3 \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++0x

INCS_Release := \
	-I$(srcdir)/deps/v8_inspector/third_party/v8_inspector \
	-I$(srcdir)/deps/v8/include \
	-I$(srcdir)/deps/v8 \
	-I$(obj)/gen/blink

OBJS := \
	$(obj).target/$(TARGET)/gen/blink/platform/v8_inspector/protocol/Console.o \
	$(obj).target/$(TARGET)/gen/blink/platform/v8_inspector/protocol/Debugger.o \
	$(obj).target/$(TARGET)/gen/blink/platform/v8_inspector/protocol/HeapProfiler.o \
	$(obj).target/$(TARGET)/gen/blink/platform/v8_inspector/protocol/Profiler.o \
	$(obj).target/$(TARGET)/gen/blink/platform/v8_inspector/protocol/Runtime.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/DispatcherBase.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/ErrorSupport.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/Parser.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/String16STL.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/inspector_protocol/Values.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/InjectedScript.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/InjectedScriptNative.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/InspectedContext.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/JavaScriptCallFrame.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/RemoteObjectId.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8Console.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8ConsoleAgentImpl.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8ConsoleMessage.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8Debugger.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8DebuggerAgentImpl.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8InspectorImpl.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8DebuggerScript.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8FunctionCall.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8HeapProfilerAgentImpl.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8InjectedScriptHost.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8InspectorSessionImpl.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8InternalValueType.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8ProfilerAgentImpl.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8Regex.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8RuntimeAgentImpl.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8StackTraceImpl.o \
	$(obj).target/$(TARGET)/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/V8StringUtil.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# Make sure our dependencies are built before any of us.
$(OBJS): | $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/inspector_injected_script.stamp $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/inspector_debugger_script.stamp $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/protocol_sources.stamp

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic \
	-m64

LDFLAGS_Release := \
	-pthread \
	-rdynamic \
	-m64

LIBS :=

$(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/libv8_inspector_stl.a: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/libv8_inspector_stl.a: LIBS := $(LIBS)
$(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/libv8_inspector_stl.a: TOOLSET := $(TOOLSET)
$(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/libv8_inspector_stl.a: $(OBJS) FORCE_DO_CMD
	$(call do_cmd,alink_thin)

all_deps += $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/libv8_inspector_stl.a
# Add target alias
.PHONY: v8_inspector_stl
v8_inspector_stl: $(obj).target/deps/v8_inspector/third_party/v8_inspector/platform/v8_inspector/libv8_inspector_stl.a

# Add target alias to "all" target.
.PHONY: all
all: v8_inspector_stl

