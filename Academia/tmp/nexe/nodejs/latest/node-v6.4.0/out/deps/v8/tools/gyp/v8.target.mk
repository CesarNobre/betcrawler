# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := v8
### Rules for final target.
$(obj).target/deps/v8/tools/gyp/v8.stamp: TOOLSET := $(TOOLSET)
$(obj).target/deps/v8/tools/gyp/v8.stamp: $(obj).target/deps/v8/tools/gyp/v8_maybe_snapshot.stamp FORCE_DO_CMD
	$(call do_cmd,touch)

all_deps += $(obj).target/deps/v8/tools/gyp/v8.stamp
# Add target alias
.PHONY: v8
v8: $(obj).target/deps/v8/tools/gyp/v8.stamp

# Add target alias to "all" target.
.PHONY: all
all: v8

