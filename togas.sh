# this simple script comments out the node import stuff 
# and moves selected files recursively to a folder that can be moved to gas with clasp
TARGET="gas"

# Define the input folder
SOURCE="src"

# a spec to match extension
EXT="*.mjs"

# whether to push with clasp
CLASP=true

# copy over all the files matching preservng the folder structure
find "${SOURCE}" -name "${EXT}" -print | cpio -pvdum "${TARGET}"

# the test is at the top level
cp test.mjs "${TARGET}"

# find all the copied files and comment/fixes out import and export statements
# note - this simple version naively expects that to be on 1 line
sed -i 's/^import\s\s*/\/\/import /g' $(find "${TARGET}" -name "${EXT}" -type f) 
sed -i 's/^\s*export\s\s*//g' $(find "${TARGET}" -name "${EXT}" -type f)
sed -i 's/\(.*NO-GAS\)/\/\/\1/g' $(find "${TARGET}" -name "${EXT}" -type f) 


## rename them all
cd "${TARGET}"
for f in *.mjs; do b=$(basename "$f") && n=${b%.*} && mv ${f} ${n}.js; done
for f in src/*.mjs; do b=$(basename "$f") && n=${b%.*} && mv ${f} ${n}.js; done

# now go to the target and push and open if required
if [ "$CLASP" = true ] ; then
  clasp push
fi