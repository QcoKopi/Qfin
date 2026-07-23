/**
 * QFin - GAS Backend (JSONP Version)
 * CORS-free via JSONP callback
 * Sheet ID: 1ZekYaWUgayQl82LbR9-hGYcxL69J4fteha1M56VisZs
 */

// ============================================================
// QUICK RUN - run these directly from the Apps Script editor instead of
// building a URL and opening it in a browser.
//
// HOW TO USE:
// 1. At the top of this editor, next to the "Debug" button, there's a
//    function dropdown (it may currently say "handleRequest" or similar).
// 2. Click it and pick one of the functions below (they all start with
//    "RUN_").
// 3. Click "Run".
// 4. Open the result: View menu > Logs (or Ctrl+Enter / Cmd+Enter). The
//    full JSON result is printed there.
//
// A few of these need a value (which bahan/sheet/product to check) - edit
// RUN_CONFIG right below, save, then run the matching function.
// ============================================================
const RUN_CONFIG = {
  namaBahan: 'GB Robusta Temanggung',   // used by RUN_DebugHargaBahan and RUN_SetHargaBeli (name or partial name to match, e.g. 'Angling' matches all Angling variants)
  hargaManual: 150000,                   // used by RUN_SetHargaBeli
  sheetName: 'Pembelian',                // used by RUN_DebugSheetHeader and RUN_RepairRawHeader (valid: 'Pembelian', 'AssemblyEntry')
  table: 'Pembelian_App',                // used by RUN_RepairHeader (any name from SHEET_CONFIG, e.g. 'Pembelian_App', 'Penjualan_App', 'Assembly_Entry')
  idProduk: '',                          // used by RUN_DebugResep
  noInvoice: 'INV1398',                  // used by RUN_DebugInvoiceDetail
  periode: '2026-07'                     // used by RUN_GenerateLaporanLR (format YYYY-MM)
};

function logResult_(result) {
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

// --- Historical imports ---
function RUN_ImportMasterData() { ensureSchemaMigrations(); return logResult_(importFromSheet()); }
function RUN_ImportPembelian() { ensureSchemaMigrations(); return logResult_(importPembelianHistoris()); }
function RUN_ImportStokAwal() { ensureSchemaMigrations(); return logResult_(importStokAwal()); }
function RUN_ImportCOA() { ensureSchemaMigrations(); return logResult_(importCOAFromFile()); }
function RUN_ResetStokAwalLama() { ensureSchemaMigrations(); return logResult_(resetStokAwalLama()); }
function RUN_ImportModalMasuk() { ensureSchemaMigrations(); return logResult_(importModalMasuk()); }
function RUN_ImportKasMasukYangHilang() { ensureSchemaMigrations(); return logResult_(importKasMasukYangHilang()); }
function RUN_ImportPembayaranHutangGanjar() { ensureSchemaMigrations(); return logResult_(importPembayaranHutangGanjar()); }
function RUN_BackfillPenjualanINV() { ensureSchemaMigrations(); return logResult_(backfillPenjualanINV()); }
function RUN_ReconcileAllInvoiceStatus() { ensureSchemaMigrations(); return logResult_(reconcileAllInvoiceStatus()); }
function RUN_BackfillKasMasukFromTotalBayar() { ensureSchemaMigrations(); return logResult_(backfillKasMasukFromTotalBayar()); }
function RUN_GenerateVirtualGL() { ensureSchemaMigrations(); return logResult_(generateVirtualGL(null)); }
function RUN_VerifyNeracaBalance() { ensureSchemaMigrations(); return logResult_(verifyNeracaBalance(null)); }
function RUN_DebugGLImbalance() { ensureSchemaMigrations(); return logResult_(debugGLImbalance()); }
function RUN_DebugNeracaRowCoverage() { ensureSchemaMigrations(); return logResult_(debugNeracaRowCoverage()); }
function RUN_DebugStatusBayar() { ensureSchemaMigrations(); return logResult_(debugStatusBayar()); }
function RUN_DebugKasBankMapping() { ensureSchemaMigrations(); return logResult_(debugKasBankMapping()); }
function RUN_DebugAnehPenjualan() { ensureSchemaMigrations(); return logResult_(debugAnehPenjualan()); }
function RUN_DebugPenjualanKasPairing() { ensureSchemaMigrations(); return logResult_(debugPenjualanKasPairing()); }
function RUN_DebugHppPerProduk() { ensureSchemaMigrations(); return logResult_(debugHppPerProduk()); }
function RUN_DebugSheetSnapshot() { ensureSchemaMigrations(); return logResult_(debugSheetSnapshot()); }
function RUN_DebugSaldoAwalPiutangStatus() { ensureSchemaMigrations(); return logResult_(debugSaldoAwalPiutangStatus()); }
function RUN_GetRingkasanKasBank() { ensureSchemaMigrations(); return logResult_(getRingkasanKasBank()); }
function RUN_GeneratePiutangReconciliation() { ensureSchemaMigrations(); return logResult_(generatePiutangReconciliation()); }
function RUN_GeneratePiutangReconciliationSummary() { ensureSchemaMigrations(); return logResult_(generatePiutangReconciliationSummary()); }
function RUN_DebugInvoiceDetail() { ensureSchemaMigrations(); return logResult_(debugInvoiceDetail(RUN_CONFIG.noInvoice)); }
function RUN_DebugAllInvoiceMismatches() { ensureSchemaMigrations(); return logResult_(debugAllInvoiceMismatches()); }
function RUN_GenerateHutangReconciliation() { ensureSchemaMigrations(); return logResult_(generateHutangReconciliation()); }
function RUN_GenerateHutangReconciliationSummary() { ensureSchemaMigrations(); return logResult_(generateHutangReconciliationSummary()); }
function RUN_FixPenjualanTypePembayaran() { ensureSchemaMigrations(); return logResult_(fixPenjualanTypePembayaran()); }
function RUN_GenerateNeracaReport() { ensureSchemaMigrations(); return logResult_(generateNeracaReport()); }
function RUN_GenerateRugiLabaDetailed() { ensureSchemaMigrations(); return logResult_(generateRugiLabaReportDetailed()); }
function RUN_ImportSaldoAwal() { ensureSchemaMigrations(); return logResult_(importSaldoAwal()); }
function RUN_ImportSaldoAwalStock() { ensureSchemaMigrations(); return logResult_(importSaldoAwalStock()); }
function RUN_ResetSaldoAwalStock() { ensureSchemaMigrations(); return logResult_(resetSaldoAwalStock()); }
function RUN_MigrateSampleTransaksi() { ensureSchemaMigrations(); return logResult_(migrateSampleTransaksiHistoris()); }
function RUN_PreviewSampleMigration() { ensureSchemaMigrations(); return logResult_(previewSampleMigration()); }
function RUN_DebugKodeTransaksiPenjualan() { ensureSchemaMigrations(); return logResult_(debugKodeTransaksiPenjualan()); }
function RUN_DebugSampleKemasan() { ensureSchemaMigrations(); return logResult_(debugSampleKemasan()); }
function RUN_FillMissingSampleKemasan() { ensureSchemaMigrations(); return logResult_(fillMissingSampleKemasan()); }
function RUN_GenerateLaporanLR() { ensureSchemaMigrations(); return logResult_(generateLaporanLR({ periode: RUN_CONFIG.periode })); }
function RUN_ImportAssembly() { ensureSchemaMigrations(); return logResult_(importAssemblyHistoris()); }
function RUN_ImportPenjualan() { ensureSchemaMigrations(); return logResult_(importPenjualanHistoris()); }
function RUN_DebugKasMasukImport() { ensureSchemaMigrations(); return logResult_(debugKasMasukImport()); }
function RUN_ImportKasMasuk() { ensureSchemaMigrations(); return logResult_(importKasMasukHistoris()); }
function RUN_ResetKasMasuk() { ensureSchemaMigrations(); return logResult_(resetKasMasuk()); }
function RUN_GetAllStock() { ensureSchemaMigrations(); return logResult_(getAllStock()); }
function RUN_GetStockBreakdown() { ensureSchemaMigrations(); return logResult_(getStockBreakdown()); }
function RUN_GetStockTrace() { ensureSchemaMigrations(); return logResult_(getStockTrace(RUN_CONFIG.namaBahan)); }
function RUN_GenerateStockMovements() { ensureSchemaMigrations(); return logResult_(generateStockMovementsFromHistory()); }

// --- Resets (wipe data rows, keep headers, safe to re-import after) ---
function RUN_ResetPembelian() { ensureSchemaMigrations(); return logResult_(resetPembelian()); }
function RUN_ResetAssemblyEntry() { ensureSchemaMigrations(); return logResult_(resetAssemblyEntry()); }
function RUN_ResetPenjualan() { ensureSchemaMigrations(); return logResult_(resetPenjualan()); }
function RUN_ResetInit() { ensureSchemaMigrations(); return logResult_(resetInit()); }
function RUN_ClearLogSync() { ensureSchemaMigrations(); return logResult_(clearLogSync()); }

// --- Diagnostics ---
function RUN_DebugPembelianImport() { ensureSchemaMigrations(); return logResult_(debugPembelianImport()); }
function RUN_DebugAssemblyImport() { ensureSchemaMigrations(); return logResult_(debugAssemblyImport()); }
function RUN_DebugPenjualanImport() { ensureSchemaMigrations(); return logResult_(debugPenjualanImport()); }
function RUN_DebugHargaBahan() { ensureSchemaMigrations(); return logResult_(debugHargaBahan(RUN_CONFIG.namaBahan)); }
function RUN_DebugZeroPriceMaterials() { ensureSchemaMigrations(); return logResult_(debugZeroPriceMaterials()); }
function RUN_TestKemasanMatch() { ensureSchemaMigrations(); return logResult_(getKemasanForProduk(RUN_CONFIG.idProduk)); }
function RUN_BackfillKemasanIds() { ensureSchemaMigrations(); return logResult_(backfillKemasanIds()); }
function RUN_SetHargaBeli() { ensureSchemaMigrations(); return logResult_(setHargaBeli(RUN_CONFIG.namaBahan, RUN_CONFIG.hargaManual)); }
function RUN_DebugResep() { ensureSchemaMigrations(); return logResult_(debugResep(RUN_CONFIG.idProduk)); }
function RUN_DebugSheetHeader() { ensureSchemaMigrations(); return logResult_(debugSheetHeader(RUN_CONFIG.sheetName)); }
function RUN_ListAllSheets() { ensureSchemaMigrations(); return logResult_(listAllSheets()); }
function RUN_ListResepMapping() { ensureSchemaMigrations(); return logResult_(listResepMapping()); }

// --- Repairs / maintenance ---
function RUN_RepairRawHeader() { ensureSchemaMigrations(); return logResult_(repairRawHeader(RUN_CONFIG.sheetName)); }
function RUN_RepairHeader() { ensureSchemaMigrations(); return logResult_(repairHeader(RUN_CONFIG.table)); }
function RUN_SyncHargaBeli() { ensureSchemaMigrations(); return logResult_(syncHargaBeliFromPembelian()); }
function RUN_SyncHargaKemasan() { ensureSchemaMigrations(); return logResult_(syncHargaKemasanFromPembelian()); }

const SPREADSHEET_ID = '1ZekYaWUgayQl82LbR9-hGYcxL69J4fteha1M56VisZs';

const SOURCE_SHEETS = {
  produk: 'Master produk',
  resep: 'Master Resep',
  pembelian: 'Pembelian',
  kasMasuk: 'KAS MASUK',
  penjualan: 'Penjualan',
  assembly: 'AssemblyEntry'
};

const SHEET_CONFIG = {
  Master_Produk: {
    headers: ['id_produk', 'nama_produk', 'tipe', 'kategori', 'satuan', 'harga_beli', 'harga_jual', 'stok', 'stok_min', 'status', 'created_at', 'updated_at']
  },
  Master_Resep: {
    headers: ['id_resep', 'nama_resep', 'id_produk_jadi', 'bahan', 'komposisi', 'satuan', 'status', 'created_at', 'updated_at']
  },
  Master_Customer: {
    headers: ['id_customer', 'nama_customer', 'alamat', 'telepon', 'email', 'status', 'created_at', 'updated_at']
  },
  Master_Supplier: {
    headers: ['id_supplier', 'nama_supplier', 'alamat', 'telepon', 'email', 'status', 'created_at', 'updated_at']
  },
  Master_Salesman: {
    headers: ['id_salesman', 'nama_salesman', 'telepon', 'email', 'status', 'created_at', 'updated_at']
  },
  Master_COA: {
    headers: ['coa', 'kategori_1', 'kategori_2', 'nama_akun', 'saldo_awal', 'tanggal_saldo_awal', 'status', 'created_at', 'updated_at']
  },
  Master_CashAccount: {
    headers: ['id_cash', 'nama_cash', 'tipe', 'saldo', 'status', 'created_at', 'updated_at']
  },
  Master_Kemasan: {
    headers: ['id_kemasan', 'nama_kemasan', 'kapasitas', 'satuan', 'harga', 'status', 'created_at', 'updated_at']
  },
  Price_List: {
    headers: ['id_pricelist', 'id_produk', 'nama_produk', 'berat_kg', 'hpp_per_kg', 'nama_kemasan', 'harga_kemasan', 'markup_percent', 'harga_jual', 'updated_at']
  },
  Saldo_Awal: {
    headers: ['id_saldo_awal', 'kategori', 'coa', 'nama_akun', 'tanggal', 'saldo_awal', 'created_at', 'updated_at']
  },
  Saldo_Awal_Stock: {
    headers: ['id_saldo_stock', 'tanggal', 'nama_barang', 'id_produk', 'satuan', 'qty', 'unit_cost', 'total_cost', 'akun', 'created_at', 'updated_at']
  },
  Assembly_Entry: {
    headers: ['id_assembly', 'tanggal', 'batch_no', 'sku', 'nama_barang', 'jumlah_produksi', 'penyusutan', 'overhead_percent', 'overhead_amount', 'total_harga_material', 'hpp', 'raw_material', 'jumlah_raw_material', 'harga_raw_material', 'kode_lot', 'status', 'sumber_baris', 'created_at', 'updated_at']
  },
  Pembelian_App: {
    headers: ['id_pembelian', 'tanggal', 'cost_center', 'salesman', 'no_dokumen', 'kode_transaksi', 'coa', 'nama_supplier', 'nama_barang', 'id_produk', 'jumlah', 'harga_satuan', 'total', 'kode_lot', 'notes', 'status_bayar', 'tanggal_pembayaran', 'sumber_baris', 'created_at', 'updated_at']
  },
  Penjualan_App: {
    headers: ['id_penjualan', 'tanggal', 'jatuh_tempo', 'cost_center', 'salesman', 'no_invoice', 'kode_transaksi', 'customer', 'nama_barang', 'jumlah', 'harga_satuan', 'total', 'diskon', 'total_diskon', 'ppn', 'pph', 'kemasan', 'jumlah_kemasan', 'batch_no', 'total_tagihan', 'type_pembayaran', 'status', 'total_bayar', 'tanggal_pembayaran', 'status_bayar', 'sumber_baris', 'created_at', 'updated_at']
  },
  // One row per invoice (not per line-item like Penjualan_App) - numeric
  // fields summed across all products on that invoice, nama_barang is a
  // comma-joined list. Kept in sync automatically by submitPenjualan()
  // whenever a sale is submitted. Same header structure as Penjualan_App
  // by design, so anything reading "the invoice" can use this directly
  // instead of re-aggregating Penjualan_App's line items every time.
  Penjualan_INV: {
    headers: ['id_penjualan', 'tanggal', 'jatuh_tempo', 'cost_center', 'salesman', 'no_invoice', 'kode_transaksi', 'customer', 'nama_barang', 'jumlah', 'harga_satuan', 'total', 'diskon', 'total_diskon', 'ppn', 'pph', 'kemasan', 'jumlah_kemasan', 'batch_no', 'total_tagihan', 'type_pembayaran', 'status', 'total_bayar', 'tanggal_pembayaran', 'status_bayar', 'sumber_baris', 'created_at', 'updated_at']
  },
  Kas_Masuk: {
    headers: ['id_kas', 'tanggal', 'sales', 'no_dokumen', 'cash_account', 'kode_transaksi', 'lawan_transaksi', 'no_invoice_ref', 'status', 'kas_masuk', 'keterangan', 'sumber_baris', 'created_at', 'updated_at']
  },
  Stock_Opname: {
    headers: ['id_opname', 'tanggal', 'id_produk', 'nama_produk', 'qty_sistem', 'qty_fisik', 'selisih', 'keterangan', 'created_at', 'updated_at']
  },
  Stock_Movement: {
    headers: ['id_movement', 'tanggal', 'id_produk', 'nama_produk', 'tipe', 'qty_in', 'qty_out', 'saldo', 'referensi', 'keterangan', 'created_at']
  },
  HPP_Calculation: {
    headers: ['id_hpp', 'tanggal', 'id_produk', 'nama_produk', 'tipe', 'qty_produksi', 'total_bahan', 'overhead_percent', 'overhead_amount', 'total_biaya', 'hpp_per_unit', 'referensi', 'created_at']
  },
  Laporan_LR: {
    headers: ['id_lr', 'periode', 'pendapatan', 'hpp_total', 'laba_kotor', 'biaya_operasional', 'laba_bersih', 'created_at']
  },
  Laporan_Stock: {
    headers: ['id_laporan', 'tanggal', 'id_produk', 'nama_produk', 'stok_awal', 'masuk', 'keluar', 'stok_akhir', 'hpp', 'nilai_persediaan', 'created_at']
  },
  Log_Sync: {
    headers: ['id_log', 'timestamp', 'action', 'table', 'record_id', 'status', 'message', 'user']
  },
  Config: {
    headers: ['key', 'value', 'description', 'updated_at']
  }
};

// ============================================================
// INITIALIZATION
// ============================================================
// Adds a header column to an existing sheet if it doesn't already have one
// with that name (existing rows just get a blank cell in the new column).
// Lets us evolve SHEET_CONFIG over time without breaking sheets a user
// already created under an older schema.
function ensureColumn(ss, sheetName, columnName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  if (headers.indexOf(columnName) === -1) {
    sheet.getRange(1, lastCol + 1).setValue(columnName);
  }
}

// Bump this whenever ensureColumn() calls below change. Migrations only
// re-run when the stored version is behind this number, so it stays cheap
// (one PropertiesService read) on every request once caught up - but
// CRITICALLY, unlike qfin_initialized, it does NOT permanently block new
// migrations forever. The previous design nested ensureColumn() calls
// inside the one-time qfin_initialized block, so every schema change made
// after that flag was first set silently never ran - new columns were
// never created, and data written to them (nama_barang, jumlah,
// harga_satuan, raw_material, etc.) was quietly dropped on every create().
// That was the real cause of prices/quantities staying empty.
const SCHEMA_VERSION = 9;

function ensureSchemaMigrations() {
  const props = PropertiesService.getScriptProperties();
  const current = parseInt(props.getProperty('qfin_schema_version') || '0', 10);
  if (current >= SCHEMA_VERSION) return;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Create any sheet in SHEET_CONFIG that doesn't exist yet. This used to
  // only run once ever (behind qfin_initialized), so newly-added tables
  // like Pembelian_App/Penjualan_App would never actually get created on a
  // spreadsheet that had already completed its one-time init.
  const existingSheets = ss.getSheets().map(s => s.getName());
  for (const [sheetName, config] of Object.entries(SHEET_CONFIG)) {
    if (!existingSheets.includes(sheetName)) {
      const sheet = ss.insertSheet(sheetName);
      const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
      headerRange.setValues([config.headers]);
      headerRange.setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
      sheet.setFrozenRows(1);
    }
  }

  ensureColumn(ss, 'Assembly_Entry', 'overhead_percent');
  ensureColumn(ss, 'Assembly_Entry', 'overhead_amount');
  ensureColumn(ss, 'Assembly_Entry', 'raw_material');
  ensureColumn(ss, 'Assembly_Entry', 'jumlah_raw_material');
  ensureColumn(ss, 'Assembly_Entry', 'harga_raw_material');
  ensureColumn(ss, 'Assembly_Entry', 'sumber_baris');
  ensureColumn(ss, 'Assembly_Entry', 'kode_lot');
  ensureColumn(ss, 'Kas_Masuk', 'no_invoice_ref');
  ensureColumn(ss, 'Kas_Masuk', 'status');
  ensureColumn(ss, 'Kas_Masuk', 'sumber_baris');
  ensureColumn(ss, 'Pembelian_App', 'sumber_baris');
  ensureColumn(ss, 'Penjualan_App', 'sumber_baris');
  ensureColumn(ss, 'HPP_Calculation', 'overhead_percent');
  ensureColumn(ss, 'HPP_Calculation', 'overhead_amount');

  props.setProperty('qfin_schema_version', SCHEMA_VERSION.toString());
}

function initializeSheets() {
  // Runs on every request but is a cheap no-op once caught up - see comment
  // on ensureSchemaMigrations()/SCHEMA_VERSION above.
  ensureSchemaMigrations();

  // Fast path: after the first successful run, skip the expensive
  // Config-sheet read for the one-time master-data import. Previously this
  // whole function (including the sheet-creation loop) ran on EVERY single
  // request, which meant every getAll() from the frontend paid for a full
  // ss.getSheets() scan and a Config sheet read.
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('qfin_initialized') === 'true') {
    return { success: true, message: 'Already initialized' };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const configSheet = ss.getSheetByName('Config');
  let alreadyImported = false;
  if (configSheet && configSheet.getLastRow() > 1) {
    const keys = configSheet.getRange(2, 1, configSheet.getLastRow() - 1, 1).getValues().flat();
    alreadyImported = keys.indexOf('imported') !== -1;
  }

  if (!alreadyImported) {
    const result = importFromSheet();
    if (result.success) {
      configSheet.appendRow(['imported', 'true', 'Master data imported on ' + new Date().toISOString(), new Date().toISOString()]);
    }
  }

  props.setProperty('qfin_initialized', 'true');
  return { success: true, message: 'All sheets initialized' };
}

// Manual escape hatch: call action=resetInit once (e.g. after adding a new
// sheet to SHEET_CONFIG, or if master data import needs to be re-run) to
// clear the fast-path flag so the next request re-checks everything.
function resetInit() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('qfin_initialized');
  props.deleteProperty('qfin_schema_version');
  return { success: true, message: 'Init flag cleared, next request will re-check sheets and columns' };
}

// ============================================================
// IMPORT FROM EXISTING SHEETS
// ============================================================
function importFromSheet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const timestamp = new Date().toISOString();
    const results = [];

    results.push(importProduk(ss, timestamp));
    results.push(importResep(ss, timestamp));
    results.push(importSuppliers(ss, timestamp));
    results.push(importCustomers(ss, timestamp));
    results.push(importSalesmen(ss, timestamp));
    results.push(importCOA(ss, timestamp));
    results.push(importCashAccounts(ss, timestamp));

    return { success: true, message: 'Import completed', results: results };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Case-insensitive, whitespace-tolerant column lookup. Plain
// headers.indexOf(name) requires an exact character-for-character match -
// any stray space or capitalization difference in the source sheet's
// header row makes it silently return -1, and every value read via that
// index then comes back as 0/blank with no error anywhere. This is what
// caused "Jumlah Raw Material" to import as 0 while other columns (whose
// names happened to match exactly) worked fine.
function findColIndex(headers, name) {
  const target = (name || '').toString().trim().toLowerCase();
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] && headers[i].toString().trim().toLowerCase() === target) return i;
  }
  return -1;
}

// For headers with messy/inconsistent trailing text (e.g. "Kode LOT (No
// Vendor, COA dan No FP" - the closing paren may or may not be present
// depending on how the sheet was edited), match by prefix instead of an
// exact string.
function findColIndexStartsWith(headers, prefix) {
  const target = (prefix || '').toString().trim().toLowerCase();
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] && headers[i].toString().trim().toLowerCase().startsWith(target)) return i;
  }
  return -1;
}

function formatTanggalCell(val) {
  if (val instanceof Date) {
    // toISOString() converts to UTC, but Sheets stores dates as local
    // midnight - for timezones ahead of UTC (e.g. WIB/UTC+7) that shift
    // rolls the date back by one day every time. Use local getters instead,
    // which follow the Apps Script project's timezone (should match the
    // spreadsheet's) and give back the calendar date actually shown in Sheets.
    const y = val.getFullYear();
    const m = (val.getMonth() + 1).toString().padStart(2, '0');
    const d = val.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return val ? val.toString() : '';
}

// Migrates purchase LINE ITEMS from the raw source "Pembelian" sheet into
// the app's own flat Pembelian table (one row per line item, same shape as
// the source sheet). importSuppliers()/importCOA()/importCashAccounts()
// only ever pulled distinct NAMES out of this sheet for dropdowns - the
// transaction rows themselves were never copied anywhere, which is why
// average-price calculations always saw empty data. Safe to re-run: skips
// any row whose (no_dokumen, nama_barang, jumlah, harga_satuan) combination
// already exists, so it only ever imports what's genuinely new.
// Migrates historical Assembly records from the raw "AssemblyEntry" sheet.
// That sheet uses an informal "merged cell" convention: only the FIRST row
// of a multi-material batch has DATE/BATCH NO/SKU/Nama Barang/Jumlah
// Produksi filled in; subsequent rows for the same batch leave those blank,
// relying on the reader to visually infer they're "the same as above". This
// forward-fills those blanks explicitly so every imported row is fully
// self-contained (exactly the pattern submitAssembly() now also follows -
// no more relying on position/order to know which batch a row belongs to).
// Safe to re-run: skips rows already present (by batch_no+raw_material+qty).
// One-shot diagnostic for the Assembly import: shows exactly how many
// source rows have their own BATCH NO, how many get correctly recovered by
// forward-fill from a preceding row, and how many genuinely have no batch
// to inherit from at all (with actual row samples) - e.g. if such rows
// exist before the very first batch header in the sheet, forward-fill has
// nothing to inherit and that's a genuine gap in the source data, not a
// bug. Answers "why didn't row X import" definitively instead of guessing.
// Call: ?action=debugAssemblyImport&callback=x
function debugAssemblyImport() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.assembly);
    if (!sourceSheet) return { success: false, message: 'Source sheet "AssemblyEntry" not found' };
    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, total_baris_sumber: 0 };

    const headers = data[0];
    const col = name => findColIndex(headers, name);
    const idx = {
      tanggal: col('DATE'), batchNo: col('BATCH NO'), sku: col('SKU'),
      namaBarang: col('Nama Barang'), jumlahProduksi: col('Jumlah Produksi'),
      rawMaterial: col('Raw Material'), jumlahRaw: col('Jumlah Raw Material'), hpp: col('HPP')
    };
    const idxBeforeFallback = Object.assign({}, idx);
    const POSITIONAL_FALLBACK = { tanggal: 0, batchNo: 1, sku: 2, namaBarang: 3, jumlahProduksi: 4, rawMaterial: 5, jumlahRaw: 6, hpp: 7 };
    Object.keys(POSITIONAL_FALLBACK).forEach(key => {
      if (idx[key] === -1 && headers.length > POSITIONAL_FALLBACK[key]) idx[key] = POSITIONAL_FALLBACK[key];
    });
    if (idx.batchNo === -1 || idx.rawMaterial === -1) {
      return { success: false, message: 'Kolom "BATCH NO"/"Raw Material" tidak ditemukan. row_1 saat ini: ' + JSON.stringify(headers) };
    }
    // Direct proof of what's actually being read for Jumlah Raw Material,
    // independent of any of the forward-fill/dedup logic below.
    const sampleJumlahRawValues = [];
    for (let i = 1; i < Math.min(data.length, 6); i++) {
      sampleJumlahRawValues.push({ baris_ke: i + 1, nilai_mentah: data[i][idx.jumlahRaw], nilai_setelah_parseFloat: parseFloat(data[i][idx.jumlahRaw]) || 0 });
    }

    let lastBatchNo = '';
    let noRawMaterial = 0, hasOwnBatchNo = 0, recoveredViaForwardFill = 0, stillNoBatchContext = 0;
    const sampleStillBlank = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rawMaterial = (row[idx.rawMaterial] || '').toString().trim();
      if (!rawMaterial) { noRawMaterial++; continue; }

      const batchNoCell = (row[idx.batchNo] || '').toString().trim();
      if (batchNoCell) {
        hasOwnBatchNo++;
        lastBatchNo = batchNoCell;
      } else if (lastBatchNo) {
        recoveredViaForwardFill++;
      } else {
        stillNoBatchContext++;
        if (sampleStillBlank.length < 20) sampleStillBlank.push({ baris_ke: i + 1, isi: row });
      }
    }

    const assemblySheet = ss.getSheetByName('Assembly_Entry');
    const appRowCount = assemblySheet && assemblySheet.getLastRow() > 1 ? assemblySheet.getLastRow() - 1 : 0;

    return {
      success: true,
      header_asli_row_1: headers,
      index_kolom_hasil_pencarian_nama: idxBeforeFallback,
      index_kolom_final_setelah_fallback_posisi: idx,
      contoh_nilai_jumlah_raw_material: sampleJumlahRawValues,
      total_baris_sumber: data.length - 1,
      baris_tanpa_raw_material_sama_sekali: noRawMaterial,
      baris_punya_batch_no_sendiri: hasOwnBatchNo,
      baris_batch_kosong_berhasil_forward_fill: recoveredViaForwardFill,
      baris_batch_kosong_dan_tidak_ada_batch_sebelumnya: stillNoBatchContext,
      contoh_baris_gagal_forward_fill: sampleStillBlank,
      baris_saat_ini_di_assembly_entry: appRowCount
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importAssemblyHistoris() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.assembly);
    if (!sourceSheet) return { success: false, message: 'Source sheet "AssemblyEntry" not found' };

    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, created: 0, skipped_existing: 0 };

    const headers = data[0];
    const col = name => findColIndex(headers, name);
    const idx = {
      tanggal: col('DATE'),
      batchNo: col('BATCH NO'),
      sku: col('SKU'),
      namaBarang: col('Nama Barang'),
      jumlahProduksi: col('Jumlah Produksi'),
      rawMaterial: col('Raw Material'),
      jumlahRaw: col('Jumlah Raw Material'),
      hpp: col('HPP')
    };
    // Belt-and-suspenders: fall back to known column POSITIONS for anything
    // name-matching didn't find. Multiple real data samples have confirmed
    // this source sheet's column order is always DATE, BATCH NO, SKU,
    // Nama Barang, Jumlah Produksi, Raw Material, Jumlah Raw Material, HPP
    // (indices 0-7) - so this is a reliable fallback even if the header
    // text itself turns out to be something case/whitespace-matching still
    // can't catch (e.g. a different word entirely, or a hidden character).
    const POSITIONAL_FALLBACK = { tanggal: 0, batchNo: 1, sku: 2, namaBarang: 3, jumlahProduksi: 4, rawMaterial: 5, jumlahRaw: 6, hpp: 7 };
    Object.keys(POSITIONAL_FALLBACK).forEach(key => {
      if (idx[key] === -1 && headers.length > POSITIONAL_FALLBACK[key]) {
        idx[key] = POSITIONAL_FALLBACK[key];
      }
    });
    if (idx.batchNo === -1 || idx.rawMaterial === -1) {
      return { success: false, message: 'Kolom "BATCH NO"/"Raw Material" tidak ditemukan di sheet AssemblyEntry' };
    }

    const produkSheet = ss.getSheetByName('Master_Produk');
    const produkLookup = {};
    const produkHargaBeli = {}; // id_produk -> harga_beli, for the final pricing fallback (e.g. old-stock items with no purchase history, set manually via setHargaBeli)
    if (produkSheet && produkSheet.getLastRow() > 1) {
      const produkHeaders = produkSheet.getRange(1, 1, 1, produkSheet.getLastColumn()).getValues()[0];
      const hargaBeliColIdx = produkHeaders.indexOf('harga_beli');
      const produkRows = produkSheet.getRange(2, 1, produkSheet.getLastRow() - 1, produkSheet.getLastColumn()).getValues();
      produkRows.forEach(row => {
        if (row[1]) produkLookup[row[1].toString().trim().toLowerCase()] = row[0];
        if (hargaBeliColIdx !== -1 && row[0]) produkHargaBeli[row[0].toString().trim()] = parseFloat(row[hargaBeliColIdx]) || 0;
      });
    }

    // Pass 1: forward-fill batch-level fields.
    let lastTanggal = '', lastBatchNo = '', lastSku = '', lastNamaBarang = '', lastJumlahProduksi = 0;
    const filled = [];
    let skippedNoRawMaterial = 0, skippedNoBatchContext = 0;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rawMaterial = (row[idx.rawMaterial] || '').toString().trim();
      if (!rawMaterial) { skippedNoRawMaterial++; continue; }

      const batchNoCell = (row[idx.batchNo] || '').toString().trim();
      let tanggal, batchNo, sku, namaBarang, jumlahProduksi;
      if (batchNoCell) {
        tanggal = formatTanggalCell(row[idx.tanggal]);
        batchNo = batchNoCell;
        sku = (row[idx.sku] || '').toString().trim();
        namaBarang = (row[idx.namaBarang] || '').toString().trim();
        jumlahProduksi = parseFloat(row[idx.jumlahProduksi]) || 0;
        lastTanggal = tanggal; lastBatchNo = batchNo; lastSku = sku;
        lastNamaBarang = namaBarang; lastJumlahProduksi = jumlahProduksi;
      } else {
        tanggal = lastTanggal; batchNo = lastBatchNo; sku = lastSku;
        namaBarang = lastNamaBarang; jumlahProduksi = lastJumlahProduksi;
      }
      if (!batchNo) { skippedNoBatchContext++; continue; } // no batch context established yet (row appears before any batch header)

      filled.push({
        sourceRow: i + 1,
        tanggal: tanggal, batchNo: batchNo, sku: sku, namaBarang: namaBarang,
        jumlahProduksi: jumlahProduksi, rawMaterial: rawMaterial,
        jumlahRaw: parseFloat(row[idx.jumlahRaw]) || 0,
        hppCell: parseFloat(row[idx.hpp]) || 0
      });
    }

    const assemblySheet = ss.getSheetByName('Assembly_Entry');
    const existingRows = assemblySheet.getLastRow() > 1
      ? assemblySheet.getRange(2, 1, assemblySheet.getLastRow() - 1, assemblySheet.getLastColumn()).getValues()
      : [];
    const aHeaders = assemblySheet.getRange(1, 1, 1, assemblySheet.getLastColumn()).getValues()[0];
    const aSumberIdx = aHeaders.indexOf('sumber_baris');
    // Dedup by exact source row number, not by content. A content-based key
    // (batch_no + raw_material + qty) looked reasonable but silently
    // collided whenever two DIFFERENT batches happened to use the same
    // common ingredient at the same quantity (e.g. "RB Arabika Jawa Barat"
    // at 1.5kg shows up across many unrelated batches) - each collision
    // caused a real, distinct row to be skipped as a false "duplicate".
    // Only import-created rows carry a sumber_baris value, so rows made by
    // real Assembly submissions (via the app UI) never collide with this.
    const existingSourceRows = new Set(
      aSumberIdx !== -1 ? existingRows.map(row => row[aSumberIdx]).filter(v => v !== '' && v !== undefined && v !== null) : []
    );

    // Compute raw-material average purchase prices ONCE for every distinct
    // material involved, instead of calling getHargaRataRataPembelian
    // (which reads the entire Pembelian_App sheet) once per row - that was
    // re-reading a many-hundred-row sheet up to 480 times in a single run.
    const pembelianAll = getAll('Pembelian_App', ss);
    const priceAgg = {}; // lowercased bahan name/id -> {qty, value}
    if (pembelianAll.success) {
      pembelianAll.data.forEach(d => {
        const qty = parseFloat(d.jumlah) || 0;
        const harga = parseFloat(d.harga_satuan) || 0;
        if (qty <= 0) return;
        const keys = [(d.id_produk || '').toString().trim(), (d.nama_barang || '').toString().trim().toLowerCase()].filter(k => k);
        keys.forEach(k => {
          if (!priceAgg[k]) priceAgg[k] = { qty: 0, value: 0 };
          priceAgg[k].qty += qty;
          priceAgg[k].value += qty * harga;
        });
      });
    }

    const avgPrice = (bahanId, namaBahan) => {
      const byId = bahanId ? priceAgg[bahanId] : null;
      const byName = priceAgg[(namaBahan || '').toString().trim().toLowerCase()];
      const agg = byId || byName;
      return agg && agg.qty > 0 ? agg.value / agg.qty : 0;
    };

    // Kode LOT per raw material: find the closest Pembelian_App purchase of
    // that material ON OR BEFORE the assembly's own date (best-effort FIFO
    // assumption), falling back to the earliest available purchase if none
    // predates the assembly.
    const pembelianByMaterial = {};
    if (pembelianAll.success) {
      pembelianAll.data.forEach(d => {
        const keys = [(d.id_produk || '').toString().trim(), (d.nama_barang || '').toString().trim().toLowerCase()].filter(k => k);
        keys.forEach(k => {
          if (!pembelianByMaterial[k]) pembelianByMaterial[k] = [];
          pembelianByMaterial[k].push({ tanggal: d.tanggal, kode_lot: d.kode_lot || '' });
        });
      });
      Object.values(pembelianByMaterial).forEach(arr => arr.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)));
    }
    const resolveKodeLot = (bahanId, namaBahan, assemblyTanggal) => {
      const list = (bahanId && pembelianByMaterial[bahanId]) || pembelianByMaterial[(namaBahan || '').toString().trim().toLowerCase()];
      if (!list || list.length === 0) return '';
      const targetDate = new Date(assemblyTanggal);
      let best = null;
      for (const entry of list) {
        if (new Date(entry.tanggal) <= targetDate) best = entry; else break;
      }
      if (!best) best = list[0];
      return best.kode_lot || '';
    };

    // Enrich every row with its resolved material id/lot (price comes next,
    // via multi-pass resolution below), then group by batch_no.
    const enrichedRows = filled.map(r => {
      const bahanId = produkLookup[r.rawMaterial.toLowerCase()] || '';
      const isGB = /^gb/i.test(bahanId) || /^gb/i.test(r.rawMaterial);
      const kodeLot = resolveKodeLot(bahanId, r.rawMaterial, r.tanggal);
      return Object.assign({}, r, { bahanId, isGB, kodeLot });
    });

    const batchGroups = {};
    enrichedRows.forEach(r => {
      if (!batchGroups[r.batchNo]) batchGroups[r.batchNo] = { outputQty: r.jumlahProduksi, sku: r.sku, rows: [] };
      batchGroups[r.batchNo].rows.push(r);
    });

    // Multi-pass resolution: a batch's raw material is sometimes itself the
    // OUTPUT of another batch in this same import (a houseblend is made
    // from earlier-roasted RB, a "250gr" pack from RB or a houseblend) -
    // that ingredient was never purchased, so it has no Pembelian price at
    // all; its real cost is whatever HPP its OWN batch resolves to. Batches
    // aren't necessarily listed in dependency order, so resolve repeatedly:
    // each pass prices whatever batches it can (Pembelian price, or an
    // already-resolved sibling batch's HPP from a previous pass), and any
    // newly-resolved batch's HPP becomes available as a price source for
    // the next pass. The real production tiers here are only 3 deep
    // (GB -> RB -> Houseblend -> pack), so a handful of passes is enough
    // to fully converge; the final pass uses whatever prices are available
    // even if incomplete, rather than leaving a batch entirely at 0.
    const resolvedSkuPrice = {};
    const MAX_PASSES = 6;
    for (let pass = 0; pass < MAX_PASSES; pass++) {
      let resolvedAny = false;
      Object.keys(batchGroups).forEach(b => {
        const batch = batchGroups[b];
        if (batch.hpp !== undefined) return; // already resolved in an earlier pass

        let allPriced = true;
        let materialCost = 0, gbQty = 0;
        batch.rows.forEach(r => {
          let price = r.hppCell > 0 ? r.hppCell : avgPrice(r.bahanId, r.rawMaterial);
          if (price <= 0) {
            const selfKey = r.bahanId || r.rawMaterial.toLowerCase();
            if (resolvedSkuPrice[selfKey] !== undefined) price = resolvedSkuPrice[selfKey];
          }
          if (price <= 0 && r.bahanId && produkHargaBeli[r.bahanId] > 0) {
            price = produkHargaBeli[r.bahanId];
          }
          if (price <= 0) allPriced = false;
          r.resolvedPrice = price;
          materialCost += r.jumlahRaw * price;
          if (r.isGB) gbQty += r.jumlahRaw;
        });

        const isLastPass = pass === MAX_PASSES - 1;
        if (!allPriced && !isLastPass) return; // give it another pass to see if a sibling batch resolves first

        batch.materialCost = materialCost;
        batch.overheadPercent = 0;
        batch.overheadAmount = 0;
        batch.hpp = batch.outputQty > 0 ? materialCost / batch.outputQty : 0;
        batch.penyusutan = gbQty > 0 && batch.outputQty > 0 ? ((gbQty - batch.outputQty) / gbQty) * 100 : 0;
        resolvedAny = true;

        if (batch.sku && batch.hpp > 0) {
          resolvedSkuPrice[batch.sku] = batch.hpp;
          const skuName = (produkLookup && Object.keys(produkLookup).find(n => produkLookup[n] === batch.sku)) || '';
          if (skuName) resolvedSkuPrice[skuName] = batch.hpp;
        }
      });
      if (!resolvedAny) break;
    }
    // Safety net: the loop above can exit early (if a pass makes no
    // progress) while some batches are still unresolved - e.g. a genuine
    // circular/unresolvable dependency, or a material with no price source
    // anywhere. Force-resolve anything left so every batch gets real
    // numbers instead of undefined (unpriced ingredients just count as 0
    // rather than blocking the whole batch's HPP from being computed).
    Object.keys(batchGroups).forEach(b => {
      const batch = batchGroups[b];
      if (batch.hpp !== undefined) return;
      let materialCost = 0, gbQty = 0;
      batch.rows.forEach(r => {
        let price = r.hppCell > 0 ? r.hppCell : avgPrice(r.bahanId, r.rawMaterial);
        if (price <= 0) {
          const selfKey = r.bahanId || r.rawMaterial.toLowerCase();
          if (resolvedSkuPrice[selfKey] !== undefined) price = resolvedSkuPrice[selfKey];
        }
        if (price <= 0 && r.bahanId && produkHargaBeli[r.bahanId] > 0) {
          price = produkHargaBeli[r.bahanId];
        }
        r.resolvedPrice = price;
        materialCost += r.jumlahRaw * price;
        if (r.isGB) gbQty += r.jumlahRaw;
      });
      batch.materialCost = materialCost;
      batch.overheadPercent = 0;
      batch.overheadAmount = 0;
      batch.hpp = batch.outputQty > 0 ? materialCost / batch.outputQty : 0;
      batch.penyusutan = gbQty > 0 && batch.outputQty > 0 ? ((gbQty - batch.outputQty) / gbQty) * 100 : 0;
    });

    let skipped = 0;
    const toCreate = [];
    enrichedRows.forEach(r => {
      if (existingSourceRows.has(r.sourceRow)) { skipped++; return; }
      const batch = batchGroups[r.batchNo];

      toCreate.push({
        id_assembly: generateId('ASM'),
        tanggal: r.tanggal,
        batch_no: r.batchNo,
        sku: r.sku,
        nama_barang: r.namaBarang,
        jumlah_produksi: r.jumlahProduksi,
        penyusutan: parseFloat(batch.penyusutan.toFixed(2)),
        overhead_percent: batch.overheadPercent,
        overhead_amount: batch.overheadAmount,
        total_harga_material: batch.materialCost,
        hpp: batch.hpp,
        raw_material: r.rawMaterial,
        jumlah_raw_material: r.jumlahRaw,
        harga_raw_material: r.resolvedPrice || 0,
        kode_lot: r.kodeLot,
        status: 'Import historis',
        sumber_baris: r.sourceRow
      });
      existingSourceRows.add(r.sourceRow);
    });

    const bulkResult = bulkCreate('Assembly_Entry', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;

    return { success: true, created: created, skipped_no_raw_material: skippedNoRawMaterial, skipped_no_batch_context: skippedNoBatchContext, skipped_existing: skipped, total_baris_sumber: data.length - 1 };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Migrates historical Penjualan records from the raw "Penjualan" sheet into
// the app's flat Penjualan table. Most historical rows only have
// invoice-level totals (no item breakdown), which is fine - they still
// import with nama_barang left blank, useful for revenue/customer reporting.
// Safe to re-run: skips rows already present (by no_invoice+nama_barang+jumlah).
// Verify the raw "KAS MASUK" sheet's structure before importing - shows
// the actual header row and a sample of parsed values, so any column-name
// mismatch is caught here instead of causing a silent bad import.
// Call: ?action=debugKasMasukImport&callback=x
function debugKasMasukImport() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.kasMasuk);
    if (!sourceSheet) return { success: false, message: 'Source sheet "' + SOURCE_SHEETS.kasMasuk + '" not found. ' + JSON.stringify(ss.getSheets().map(s => s.getName())) };
    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, total_baris_sumber: 0, header_asli_row_1: data[0] || [] };

    const headers = data[0];
    const col = name => findColIndex(headers, name);
    const idx = {
      tanggal: col('Tanggal'), sales: col('Sales'), noDokumen: col('No Dokumen'),
      cashAccount: col('Cash Account'), kodeTransaksi: col('Kode Transaksi'),
      lawanTransaksi: col('Lawan Transaksi'), jumlah: col('Kas Masuk'), keterangan: col('Keterangan')
    };

    const kasSheet = ss.getSheetByName('Kas_Masuk');
    const appRowCount = kasSheet && kasSheet.getLastRow() > 1 ? kasSheet.getLastRow() - 1 : 0;

    return {
      success: true,
      header_asli_row_1: headers,
      index_kolom_hasil_pencarian_nama: idx,
      total_baris_sumber: data.length - 1,
      contoh_baris: data.slice(1, 4).map(row => idx.tanggal !== -1 ? {
        tanggal: row[idx.tanggal], sales: idx.sales !== -1 ? row[idx.sales] : null,
        no_dokumen: idx.noDokumen !== -1 ? row[idx.noDokumen] : null,
        cash_account: idx.cashAccount !== -1 ? row[idx.cashAccount] : null,
        kode_transaksi: idx.kodeTransaksi !== -1 ? row[idx.kodeTransaksi] : null,
        lawan_transaksi: idx.lawanTransaksi !== -1 ? row[idx.lawanTransaksi] : null,
        jumlah: idx.jumlah !== -1 ? row[idx.jumlah] : null
      } : row),
      baris_saat_ini_di_kas_masuk: appRowCount
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importKasMasukHistoris() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.kasMasuk);
    if (!sourceSheet) return { success: false, message: 'Source sheet "' + SOURCE_SHEETS.kasMasuk + '" not found' };
    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, created: 0, total_baris_sumber: 0 };

    const headers = data[0];
    const col = name => findColIndex(headers, name);
    const idx = {
      tanggal: col('Tanggal'), sales: col('Sales'), noDokumen: col('No Dokumen'),
      cashAccount: col('Cash Account'), kodeTransaksi: col('Kode Transaksi'),
      lawanTransaksi: col('Lawan Transaksi'), jumlah: col('Kas Masuk'), keterangan: col('Keterangan')
    };
    if (idx.jumlah === -1) {
      return { success: false, message: 'Kolom "Kas Masuk" tidak ditemukan. row_1: ' + JSON.stringify(headers) };
    }

    const kasSheet = ss.getSheetByName('Kas_Masuk');
    const existingRows = kasSheet.getLastRow() > 1
      ? kasSheet.getRange(2, 1, kasSheet.getLastRow() - 1, kasSheet.getLastColumn()).getValues()
      : [];
    const kHeaders = kasSheet.getRange(1, 1, 1, kasSheet.getLastColumn()).getValues()[0];
    const sumberIdx = kHeaders.indexOf('sumber_baris');
    const existingSourceRows = new Set(
      sumberIdx !== -1 ? existingRows.map(row => row[sumberIdx]).filter(v => v !== '' && v !== undefined && v !== null) : []
    );

    const val = (row, i) => (i === -1 ? '' : row[i]);

    let skippedBlank = 0;
    const toCreate = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const sourceRow = i + 1;
      const jumlah = parseFloat(val(row, idx.jumlah)) || 0;
      if (jumlah <= 0) { skippedBlank++; continue; }
      if (existingSourceRows.has(sourceRow)) continue;

      const kodeTransaksi = (val(row, idx.kodeTransaksi) || '').toString();
      const lawanTransaksi = (val(row, idx.lawanTransaksi) || '').toString();

      toCreate.push({
        id_kas: generateId('KAS'),
        tanggal: formatTanggalCell(val(row, idx.tanggal)),
        sales: val(row, idx.sales) || '',
        no_dokumen: val(row, idx.noDokumen) || '',
        cash_account: val(row, idx.cashAccount) || '',
        kode_transaksi: kodeTransaksi,
        lawan_transaksi: lawanTransaksi,
        no_invoice_ref: '',
        status: '',
        kas_masuk: jumlah,
        keterangan: val(row, idx.keterangan) || '',
        sumber_baris: sourceRow
      });
    }

    const bulkResult = bulkCreate('Kas_Masuk', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;

    return { success: true, created: created, skipped_jumlah_kosong: skippedBlank, total_baris_sumber: data.length - 1 };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importPenjualanHistoris() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.penjualan);
    if (!sourceSheet) return { success: false, message: 'Source sheet "Penjualan" not found' };

    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, created: 0, skipped_existing: 0 };

    const headers = data[0];
    const col = name => findColIndex(headers, name);
    const idx = {
      tanggal: col('Tanggal'),
      jatuhTempo: col('Jatuh Tempo'),
      costCenter: col('Cost Center'),
      salesman: col('Salesman'),
      noInvoice: col('No INVOICE'),
      kodeTransaksi: col('Kode Transaksi'),
      customer: 7, // unlabeled column between Kode Transaksi and Nama Barang - same convention importCustomers() already relies on
      namaBarang: col('Nama Barang'),
      jumlah: col('Jumlah'),
      hargaSatuan: col('Harga Satuan'),
      total: col('Total'),
      diskon: col('Diskon (Rp)'),
      totalDiskon: col('Total-Diskon'),
      ppn: col('PPN'),
      pph: col('PPh 23'),
      totalTagihan: col('Total Tagihan'),
      typePembayaran: col('Type Pembayaran'),
      kemasan: col('Kemasan'),
      jumlahKemasan: col('Jumlah Kemasan'),
      status: col('Status'),
      totalBayar: col('Total Bayar'),
      tanggalBayar: col('Tanggal Pembayaran'),
      statusBayar: col('Status Bayar'),
      batchNo: col('Batch No')
    };
    if (idx.noInvoice === -1) {
      return { success: false, message: 'Kolom "No INVOICE" tidak ditemukan di sheet Penjualan' };
    }

    const penjualanSheet = ss.getSheetByName('Penjualan_App');
    const existingRows = penjualanSheet.getLastRow() > 1
      ? penjualanSheet.getRange(2, 1, penjualanSheet.getLastRow() - 1, penjualanSheet.getLastColumn()).getValues()
      : [];
    const pHeaders = penjualanSheet.getRange(1, 1, 1, penjualanSheet.getLastColumn()).getValues()[0];
    const pSumberIdx = pHeaders.indexOf('sumber_baris');
    // Dedup by exact source row number - see comment in importAssemblyHistoris
    // for why content-based keys (no_invoice+nama_barang+jumlah) are unsafe:
    // most historical rows share blank nama_barang/jumlah, so any duplicate
    // no_invoice value alone was enough to cause a false-duplicate skip.
    const existingSourceRows = new Set(
      pSumberIdx !== -1 ? existingRows.map(row => row[pSumberIdx]).filter(v => v !== '' && v !== undefined && v !== null) : []
    );

    const val = (row, i) => (i === -1 ? '' : row[i]);
    const num = (row, i) => (i === -1 ? 0 : (parseFloat(row[i]) || 0));

    let skipped = 0, skippedNoInvoice = 0;
    const toCreate = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const sourceRow = i + 1;
      const noInvoice = (val(row, idx.noInvoice) || '').toString().trim();
      if (!noInvoice) { skippedNoInvoice++; continue; }
      if (existingSourceRows.has(sourceRow)) { skipped++; continue; }

      const namaBarang = (val(row, idx.namaBarang) || '').toString().trim();
      const jumlah = num(row, idx.jumlah);

      toCreate.push({
        id_penjualan: generateId('PEN'),
        tanggal: formatTanggalCell(val(row, idx.tanggal)),
        jatuh_tempo: idx.jatuhTempo !== -1 ? formatTanggalCell(val(row, idx.jatuhTempo)) : '',
        cost_center: val(row, idx.costCenter) || '',
        salesman: val(row, idx.salesman) || '',
        no_invoice: noInvoice,
        kode_transaksi: val(row, idx.kodeTransaksi) || '',
        customer: val(row, idx.customer) || '',
        nama_barang: namaBarang,
        jumlah: jumlah,
        harga_satuan: num(row, idx.hargaSatuan),
        total: num(row, idx.total),
        diskon: num(row, idx.diskon),
        total_diskon: num(row, idx.totalDiskon),
        ppn: num(row, idx.ppn),
        pph: num(row, idx.pph),
        kemasan: val(row, idx.kemasan) || '',
        jumlah_kemasan: num(row, idx.jumlahKemasan),
        batch_no: (val(row, idx.batchNo) || '').toString(),
        total_tagihan: num(row, idx.totalTagihan),
        type_pembayaran: val(row, idx.typePembayaran) || '',
        status: val(row, idx.status) || '',
        total_bayar: num(row, idx.totalBayar),
        tanggal_pembayaran: idx.tanggalBayar !== -1 ? formatTanggalCell(val(row, idx.tanggalBayar)) : '',
        status_bayar: val(row, idx.statusBayar) || '',
        sumber_baris: sourceRow
      });
      existingSourceRows.add(sourceRow);
    }

    const bulkResult = bulkCreate('Penjualan_App', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;

    return { success: true, created: created, skipped_no_invoice: skippedNoInvoice, skipped_existing: skipped, total_baris_sumber: data.length - 1 };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// One-shot, complete diagnostic for the Pembelian import: categorizes every
// single source row and shows samples, so there's no more guessing about
// why created-row counts don't match the source row count.
// Call: ?action=debugPembelianImport&callback=x
// One-shot diagnostic for the Penjualan import, mirroring
// debugPembelianImport: shows exactly how many source rows are missing
// No Invoice (legitimately unimportable) vs how many are valid, plus
// samples, so a count gap is never left unexplained again.
// Call: ?action=debugPenjualanImport&callback=x
// Shows every distinct kode_transaksi value currently in Penjualan_App,
// with row counts and total value - needed before building any migration
// logic around "Sample" transactions, since guessing the exact wording
// used in the data (vs "Sampel", "Sample Produk", etc.) risks matching
// nothing or matching too much.
// Call: ?action=debugKodeTransaksiPenjualan&callback=x
// Checks whether Sample transactions in Penjualan_App actually have
// kemasan + jumlah_kemasan filled in - the stock ledger already reduces
// kemasan stock for ANY Penjualan_App row with these fields set
// (regardless of kode_transaksi), so if kemasan isn't being reduced for
// samples, it's because the DATA is missing, not the logic.
// Call: ?action=debugSampleKemasan&callback=x
// Backfills kemasan='Kemasan Sample', jumlah_kemasan=1 for Sample rows
// that are currently missing this data - matches the pattern already used
// consistently in the other 31 out of 41 rows, so this is filling in what
// was very likely just not recorded rather than genuinely different.
// Call: ?action=fillMissingSampleKemasan&callback=x
function fillMissingSampleKemasan() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Penjualan_App');
    if (!sheet) return { success: false, message: 'Sheet Penjualan_App not found' };
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: true, updated: 0 };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const kodeIdx = headers.indexOf('kode_transaksi');
    const kemasanIdx = headers.indexOf('kemasan');
    const jumlahKemasanIdx = headers.indexOf('jumlah_kemasan');
    if (kodeIdx === -1 || kemasanIdx === -1 || jumlahKemasanIdx === -1) {
      return { success: false, message: 'Kolom kode_transaksi/kemasan/jumlah_kemasan tidak ditemukan' };
    }

    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    let updated = 0;
    data.forEach((row, i) => {
      const isSample = (row[kodeIdx] || '').toString().trim().toLowerCase() === 'sample';
      const kemasanKosong = !(row[kemasanIdx] || '').toString().trim();
      const jumlahKemasanKosong = !(parseFloat(row[jumlahKemasanIdx]) > 0);
      if (isSample && kemasanKosong && jumlahKemasanKosong) {
        sheet.getRange(i + 2, kemasanIdx + 1).setValue('Kemasan Sample');
        sheet.getRange(i + 2, jumlahKemasanIdx + 1).setValue(1);
        updated++;
      }
    });

    return { success: true, updated: updated };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugSampleKemasan() {
  try {
    const all = getAll('Penjualan_App');
    if (!all.success) return all;
    const sampleRows = all.data.filter(r => (r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample');
    const denganKemasan = sampleRows.filter(r => (r.kemasan || '').toString().trim() && (parseFloat(r.jumlah_kemasan) || 0) > 0);
    const tanpaKemasan = sampleRows.filter(r => !((r.kemasan || '').toString().trim() && (parseFloat(r.jumlah_kemasan) || 0) > 0));
    return {
      success: true,
      total_baris_sample: sampleRows.length,
      punya_data_kemasan: denganKemasan.length,
      contoh_punya_kemasan: denganKemasan.slice(0, 5).map(r => ({ nama_barang: r.nama_barang, kemasan: r.kemasan, jumlah_kemasan: r.jumlah_kemasan })),
      tidak_ada_data_kemasan: tanpaKemasan.length,
      contoh_tidak_ada_kemasan: tanpaKemasan.slice(0, 5).map(r => ({ nama_barang: r.nama_barang, kemasan: r.kemasan, jumlah_kemasan: r.jumlah_kemasan }))
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugKodeTransaksiPenjualan() {
  try {
    const all = getAll('Penjualan_App');
    if (!all.success) return all;
    const groups = {};
    all.data.forEach(r => {
      const kode = (r.kode_transaksi || '(kosong)').toString();
      if (!groups[kode]) groups[kode] = { jumlah_baris: 0, total_nilai: 0, contoh_barang: [] };
      groups[kode].jumlah_baris++;
      groups[kode].total_nilai += parseFloat(r.total) || 0;
      if (groups[kode].contoh_barang.length < 3) groups[kode].contoh_barang.push(r.nama_barang);
    });
    return { success: true, distinct_kode_transaksi: groups };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugPenjualanImport() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.penjualan);
    if (!sourceSheet) return { success: false, message: 'Source sheet "Penjualan" not found' };
    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, total_baris_sumber: 0 };

    const headers = data[0];
    const col = name => findColIndex(headers, name);
    const idx = { noInvoice: col('No INVOICE') };
    if (idx.noInvoice === -1) {
      return { success: false, message: 'Kolom "No INVOICE" tidak ditemukan. row_1 saat ini: ' + JSON.stringify(headers) };
    }

    let validRows = 0, blankInvoice = 0;
    const sampleBlankInvoice = [];
    for (let i = 1; i < data.length; i++) {
      const noInvoice = (data[i][idx.noInvoice] || '').toString().trim();
      if (!noInvoice) {
        blankInvoice++;
        if (sampleBlankInvoice.length < 15) sampleBlankInvoice.push({ baris_ke: i + 1, isi: data[i] });
      } else {
        validRows++;
      }
    }

    const appSheet = ss.getSheetByName('Penjualan_App');
    const appRowCount = appSheet && appSheet.getLastRow() > 1 ? appSheet.getLastRow() - 1 : 0;
    const appHeaders = appSheet && appSheet.getLastRow() > 0 ? appSheet.getRange(1, 1, 1, appSheet.getLastColumn()).getValues()[0] : [];
    const sumberIdx = appHeaders.indexOf('sumber_baris');
    let baris_dengan_sumber_baris_terisi = 0;
    if (appSheet && sumberIdx !== -1 && appRowCount > 0) {
      const sumberVals = appSheet.getRange(2, sumberIdx + 1, appRowCount, 1).getValues().flat();
      baris_dengan_sumber_baris_terisi = sumberVals.filter(v => v !== '' && v !== undefined && v !== null).length;
    }

    return {
      success: true,
      total_baris_sumber: data.length - 1,
      valid_ada_no_invoice: validRows,
      blank_no_invoice: blankInvoice,
      contoh_baris_blank_invoice: sampleBlankInvoice,
      baris_saat_ini_di_penjualan_app: appRowCount,
      kolom_sumber_baris_ada_di_penjualan_app: sumberIdx !== -1,
      baris_dengan_sumber_baris_terisi: baris_dengan_sumber_baris_terisi
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugPembelianImport() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.pembelian);
    if (!sourceSheet) return { success: false, message: 'Source sheet "Pembelian" not found' };
    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, total_baris_sumber: 0 };

    const headers = data[0];
    const col = name => findColIndex(headers, name);
    const idx = { noDokumen: col('No Dokumen'), namaBarang: col('Nama Barang') };
    if (idx.noDokumen === -1 || idx.namaBarang === -1) {
      return { success: false, message: 'Kolom "No Dokumen"/"Nama Barang" tidak ditemukan. row_1 saat ini: ' + JSON.stringify(headers) };
    }

    let validLengkap = 0, blankNamaBarangSaja = 0, blankNoDokumenSaja = 0, blankKeduanya = 0;
    const sampleBlankNamaBarang = [];
    const sampleBlankNoDokumen = [];
    const sampleBlankKeduanya = [];
    for (let i = 1; i < data.length; i++) {
      const noDok = (data[i][idx.noDokumen] || '').toString().trim();
      const namaBarang = (data[i][idx.namaBarang] || '').toString().trim();
      if (!namaBarang && !noDok) {
        blankKeduanya++;
        if (sampleBlankKeduanya.length < 15) sampleBlankKeduanya.push({ baris_ke: i + 1, isi: data[i] });
      } else if (!namaBarang) {
        blankNamaBarangSaja++;
        if (sampleBlankNamaBarang.length < 15) sampleBlankNamaBarang.push({ baris_ke: i + 1, isi: data[i] });
      } else if (!noDok) {
        blankNoDokumenSaja++;
        if (sampleBlankNoDokumen.length < 15) sampleBlankNoDokumen.push({ baris_ke: i + 1, isi: data[i] });
      } else {
        validLengkap++;
      }
    }

    const appSheet = ss.getSheetByName('Pembelian_App');
    const appRowCount = appSheet && appSheet.getLastRow() > 1 ? appSheet.getLastRow() - 1 : 0;

    return {
      success: true,
      total_baris_sumber: data.length - 1,
      valid_lengkap_no_dokumen_dan_nama_barang_ada: validLengkap,
      hanya_nama_barang_kosong: blankNamaBarangSaja,
      hanya_no_dokumen_kosong: blankNoDokumenSaja,
      keduanya_kosong: blankKeduanya,
      contoh_baris_nama_barang_kosong: sampleBlankNamaBarang,
      contoh_baris_no_dokumen_kosong: sampleBlankNoDokumen,
      contoh_baris_keduanya_kosong: sampleBlankKeduanya,
      baris_saat_ini_di_pembelian_app: appRowCount
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Initial stock balances as of Dec 10, 2025, from the uploaded stock-take
// sheet - covers coffee items (GB/RB), kemasan, AND general
// equipment/merchandise (grinders, cups, syrups, etc). Imported as
// Pembelian_App rows (kode_transaksi='Stock Awal', supplier='Saldo Awal')
// so they flow into the existing Masuk side of the stock ledger without
// needing any special-case logic - this is exactly what Pembelian_App
// already represents (stock coming in), just dated at the opening balance
// instead of an actual purchase transaction.
const STOK_AWAL_DATA = [["GB Robusta Temanggung",118.5],["GB Robusta Jawa Barat Asalan",50.0],["GB Flores Bajawa",28.85],["GB Arabika Semendo Natural",87.7],["GB Arabika Pasir Angling Natural",2.0],["GB Arabika Pasir Angling FW",2.0],["GB Arabika Jawa Barat Asalan",34.0],["GB Arabika Ciwidey Natural",30.75],["GB Arabika Brazil Cerrado",103.5],["RB Robusta Temanggung",10.85],["RB Robusta Jawa Barat",4.27],["RB Gayo Wine",0.85],["RB Gayo",1.67],["RB Arabika Natural Semendo",4.47],["RB Arabika Jawa Barat",8.1],["RB Arabika Flores Bajawa",1.94],["RB Arabika Brazil Cerrado",12.04],["RB Arabica Ciwidey Natural",3.35],["Kemasan Kopi 5kg Besar Hitam Tanpa Valve",26.0],["Flat Bottom Valve 500gr",36.0],["Kemasan Sample",43.0],["Flat Bottom Valve 1000gr",2.0],["Alat Penggiling Kopi Elektrik Coffee Grinder Adjustable - 600N - Black",1.0],["BalmyDays Long Bar Spoon Cocktail Sendok Pengaduk Panjang 30.2cm - BD16 - Silver",1.0],["BOROW Teko Listrik Kopi Pemanas Air Leher Angsa Pour Over 1000W 1000ml Non Wooden - ZK-KH301 - Black",1.0],["CLITON Alat Penggiling Kopi Elektrik Coffee Grinder Adjustable 1800mAh - CL18 - Black",1.0],["Cocktail Shaker Mixer Bartender Boston Style 700ml - B0569 - Transparent",3.0],["Dalinwell 2 in 1 Sikat Sendok Pembersih Mesin Kopi Espresso 1PCS - 8809",2.0],["Dosing Ring Portafilter Espresso Magnetic Aluminium 58mm - XA045 - Black",2.0],["Dosing Tray Mangkok Takar Biji Kopi Keramik - OX40 - White",1.0],["Filter Basket Portafilter Non-Pressurize Single Wall 58mm 1 Cup - Y58 - Silver",2.0],["Filter Penyaring Kopi V60 Glass Coffee Filter Dripper 1-4 Cups - ZM639 - Black",1.0],["Gelas Beruang Double Wall Glass Insulated Cup 250ml - CIQ38 - Transparent",2.0],["Gelas Cangkir Siera",11.0],["Gelas Jigger 30ml dan 60ml",1.0],["Gelas Susu Kopi Frothing Foam Milk Jug Espresso Latte Art 350ml - ZM078 - Silver",1.0],["Gelas Susu Kopi Frothing Foam Milk Jug Espresso Latte Art 550ml - ZM078 - Silver",1.0],["Gula Aren",15.5],["HEYCAFE HC600.2 ESPRESSO GRIND",1.0],["Holder Tamper Portafilter Kopi Corner Mat Barista Silikon - 0310-1 - Black",2.0],["IYOUNICE Tamper Kopi Espresso Coffee Press Powder Hammer 58mm - 7IYC - Dark Brown",3.0],["Januel Filter Penyaring Kopi V60 Cone Coffee Dripper Swith Valve-Jne23",1.0],["Jarum Kopi Espresso Needle Distribution Tool 84mm - MD-686 - Brown",1.0],["LAYZIN Alat Penggiling Biji Kopi Elektrik Coffee Bean Grinder 250g Stainless Steel Cup - N800 - Black",1.0],["Mesin Destoner Kopi Kapasitas 5 kg",1.0],["Mesin Ginder 1kg Muzzer",1.0],["Mesin Girnder Kapasitas 3 kg NORDIC",2.0],["Mesin Kopi Faema 2 Grup",2.0],["Mesin Kopi Cime",1.0],["Mesin Kopi Wega 2 Grup (2)",2.0],["Mesin Pembuat ES",1.0],["Mesin Roasting 15kg",1.0],["Mesin Roasting Uncle Jhon Kapasitas 1 kg",1.0],["Mesin Roasting Uncle Jhon Kapasitas 3 kg",1.0],["Mesin Sortir",1.0],["Nima Alat Penggiling Kopi Elektrik Bumbu Coffee Grinder - NM-8300 - Silver",1.0],["Papan Tulis Whiteboard",1.0],["Paper Filter V60 1-4 Cups 100 PCS - U102 - White",2.0],["PorClean Sikat Pembersih Portafilter Wooden Brush Cleaning Tools 58mm - PCN-697 - Brown",1.0],["Powder Lemon Tea 800g",6.0],["Powder Taro 800g",5.0],["Powder Vanilla 800g",2.0],["PTR TOME Timbangan kopi digital 3kg / Timer drip Coffee Scale V60-Premium",1.0],["QME Timbangan digital Scale 40kg Double Display",2.0],["Scoop Kopi Besar",2.0],["Scoop Kopi Kecil",1.0],["Seluna Toples Kaca Biji Kopi Coffee Beans Vacuum Sealed Lid 950ml - SL330 - Black",6.0],["Sendok Takar Measuring spoon + Coffee Tamper",2.0],["Server Chemex Drip Pour Over Borosilicate Glass 200ml - SE111",2.0],["Server Chemex Drip Pour Over with Filter 800ml - YD-KT001 - Transparent",2.0],["Silicone Holder Mat Tamper Kopi Espresso Barista - 0310 - Black",2.0],["Syrup Banana 750ml",12.0],["Syrup Caramel 750ml",2.0],["Syrup Hazelnut 750ml",6.0],["Syrup Kiwi 750ml",12.0],["Syrup Lemon 750ml",8.0],["Syrup Mint 750ml",1.0],["Syrup Passion Fruit 750ml",10.0],["Syrup Peach 750ml",6.0],["Syrup Vanila 750ml",9.0],["Taffware Digipounds Timbangan Kopi Digital Timer Coffee Scale 5kg 0.1g - MS-K07 - Black",2.0],["Tamper Kopi Triangle Press Coffee Powder Stainless Steel 58mm - 3153 - Black",1.0],["Teko Termos Air Panas Vacuum Jug Flask 1L - LS-029 - Black",3.0],["Timbangan Duduk Digital 200kg TCS series Electronic",1.0],["Vietnam Drip Coffee Filter Pot Saringan Kopi 124ml 7Q - LC1 - Silver",4.0],["Wadah Ampas Kopi Espresso Knock Box Container L - Fen175 - Transparent",3.0],["Wadah Ampas Kopi Espresso Knock Box Container XL - KB3 - Silver",1.0],["Wadah Ampas Kopi Knock Box with Portafilter Holder - MG34 - Black",2.0],["WM-1500G - Particle Weighing Filling Machine - Powerpack",1.0],["YUAN Sikat Mesin Kopi Espresso Machine Head Group Brush 58mm - Y5 - Black",1.0]]
;

// Creates linked Pembelian expense entries for EXISTING historical Sample
// transactions in Penjualan_App (kode_transaksi='Sample') - does NOT
// touch/delete the original Penjualan rows, matching the live behavior in
// submitPenjualan(). The historical Sample rows have no recorded value
// (total=0), so this falls back to each product's current HPP as a cost
// estimate - clearly labeled as such in the notes, since it's an estimate
// rather than the actual historical cost. Safe to re-run: dedups by
// storing the originating id_penjualan in sumber_baris.
// Shows exactly what migrateSampleTransaksiHistoris would compute for
// every Sample row (jumlah/berat, HPP per unit, resulting total) WITHOUT
// creating anything - lets the weight x HPP calculation be verified as
// sane (e.g. catching a unit mismatch like gram-recorded weights being
// multiplied against a per-kg HPP) before committing any data.
// Call: ?action=previewSampleMigration&callback=x
function previewSampleMigration() {
  try {
    const penjualanAll = getAll('Penjualan_App');
    const produkAll = getAll('Master_Produk');
    if (!penjualanAll.success) return penjualanAll;
    const sampleRows = penjualanAll.data.filter(r => (r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample');

    const produkByName = {};
    if (produkAll.success) {
      produkAll.data.forEach(p => {
        const nama = (p.nama_produk || '').toString().trim();
        const id = (p.id_produk || '').toString().trim();
        if (nama && id) produkByName[nama.toLowerCase()] = id;
      });
    }

    const preview = sampleRows.map(r => {
      // getHPP() matches against Assembly_Entry.sku, which is an ID like
      // "RB01" - passing the raw product NAME never matches anything,
      // which is why every row previously came back with hpp=0.
      const idProduk = (r.id_produk || '').toString().trim() || produkByName[(r.nama_barang || '').toString().trim().toLowerCase()] || '';
      const hppResult = idProduk ? getHPP(idProduk) : { success: false };
      const hpp = hppResult.success && hppResult.data ? (parseFloat(hppResult.data.hpp_per_unit) || 0) : 0;
      const jumlah = parseFloat(r.jumlah) || 0;
      return {
        nama_barang: r.nama_barang,
        id_produk_resolved: idProduk,
        jumlah_tercatat: jumlah,
        harga_asli_di_data: parseFloat(r.total) || 0,
        hpp_per_unit_ditemukan: hpp,
        hasil_kalkulasi_total: parseFloat((hpp * jumlah).toFixed(2))
      };
    });

    return { success: true, total_baris_sample: sampleRows.length, preview: preview };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function migrateSampleTransaksiHistoris() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const penjualanAll = getAll('Penjualan_App', ss);
    const produkAll = getAll('Master_Produk', ss);
    if (!penjualanAll.success) return penjualanAll;

    const produkByName = {};
    if (produkAll.success) {
      produkAll.data.forEach(p => {
        const nama = (p.nama_produk || '').toString().trim();
        const id = (p.id_produk || '').toString().trim();
        if (nama && id) produkByName[nama.toLowerCase()] = id;
      });
    }

    const sampleRows = penjualanAll.data.filter(r => (r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample');
    if (sampleRows.length === 0) return { success: true, created: 0, message: 'Tidak ada transaksi Sample di Penjualan_App' };

    const pembelianSheet = ss.getSheetByName('Pembelian_App');
    const existingRows = pembelianSheet.getLastRow() > 1
      ? pembelianSheet.getRange(2, 1, pembelianSheet.getLastRow() - 1, pembelianSheet.getLastColumn()).getValues()
      : [];
    const pHeaders = pembelianSheet.getRange(1, 1, 1, pembelianSheet.getLastColumn()).getValues()[0];
    const sumberIdx = pHeaders.indexOf('sumber_baris');
    const alreadyMigrated = new Set(
      sumberIdx !== -1 ? existingRows.map(row => (row[sumberIdx] || '').toString()).filter(v => v) : []
    );

    const toCreate = [];
    let skipped = 0, estimasiDipakai = 0;
    sampleRows.forEach(r => {
      if (alreadyMigrated.has(r.id_penjualan)) { skipped++; return; }

      const idProduk = (r.id_produk || '').toString().trim() || produkByName[(r.nama_barang || '').toString().trim().toLowerCase()] || '';
      let hargaSatuan = parseFloat(r.harga_satuan) || 0;
      let total = parseFloat(r.total) || 0;
      let sumberNilai = 'data_asli';
      if (total <= 0) {
        // getHPP() matches against Assembly_Entry.sku, which is an ID like
        // "RB01" - must pass the resolved ID, not the raw product name.
        const hppResult = idProduk ? getHPP(idProduk) : { success: false };
        const hpp = hppResult.success && hppResult.data ? (parseFloat(hppResult.data.hpp_per_unit) || 0) : 0;
        if (hpp > 0) {
          hargaSatuan = hpp;
          total = hpp * (parseFloat(r.jumlah) || 0);
          sumberNilai = 'estimasi_dari_hpp';
          estimasiDipakai++;
        }
      }

      toCreate.push({
        id_pembelian: generateId('PEM'),
        tanggal: r.tanggal,
        cost_center: r.cost_center || 'Q.Co',
        salesman: r.salesman || '',
        no_dokumen: r.no_invoice,
        kode_transaksi: 'Sample',
        coa: 'Biaya Sales & Marketing',
        nama_supplier: 'Qco',
        nama_barang: r.nama_barang,
        id_produk: idProduk,
        jumlah: parseFloat(r.jumlah) || 0,
        harga_satuan: hargaSatuan,
        total: total,
        kode_lot: '',
        notes: 'Biaya sample dari Penjualan ' + r.no_invoice + (sumberNilai === 'estimasi_dari_hpp' ? ' (nilai estimasi dari HPP, data asli tidak tercatat harganya)' : ''),
        status_bayar: 'Lunas',
        tanggal_pembayaran: r.tanggal,
        sumber_baris: r.id_penjualan
      });
    });

    const bulkResult = bulkCreate('Pembelian_App', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;

    return { success: true, created: created, dilewati_sudah_ada: skipped, pakai_estimasi_hpp: estimasiDipakai, total_sample_di_penjualan: sampleRows.length };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Full Chart of Accounts replacing the old Master_COA (which was just
// id/nama/tipe, far short of what a real double-entry structure needs).
// Format: [coa_code, kategori_1, kategori_2, nama_akun, saldo_awal, tanggal].
const COA_DATA = [["10100-00","1. Aktiva Lancar","1.1 Kas","Cash on Hand-IDR",1475700.0,"1/1/2026"],["10515-00","1. Aktiva Lancar","1.2 Bank","Cash in Bank BCA - IDR",-71513883.0,"1/1/2026"],["10517-00","1. Aktiva Lancar","1.2 Bank","Cash on Bank Mandiri IDR",0,""],["10520-00","1. Aktiva Lancar","1.2 Bank","Cash in Bank BNI - IDR",0,""],["10900-00","1. Aktiva Lancar","1.2 Bank","Clearing Account",0,""],["11000-00","1. Aktiva Lancar","1.3 Piutang Usaha Pihak Ketiga","Piutang Usaha",60820000.0,"1/1/2026"],["11100-00","1. Aktiva Lancar","1.3 Piutang Usaha Pihak Ketiga","Piutang Kepada PT ABC",0,""],["11101-00","1. Aktiva Lancar","1.3 Piutang Usaha Pihak Ketiga","Piutang Kepada PT DEF",0,""],["12500-00","1. Aktiva Lancar","1.4 Persediaan","Inventory",61910062.0,"1/1/2026"],["12501-00","1. Aktiva Lancar","1.4 Persediaan","Persediaan Barang Mesin Kopi",0,""],["12502-00","1. Aktiva Lancar","1.4 Persediaan","Persediaan Barang Beans",0,""],["12503-00","1. Aktiva Lancar","1.4 Persediaan","Persediaan Barang Barista Tools",0,""],["12504-00","1. Aktiva Lancar","1.4 Persediaan","Persediaan Barang Grinder",0,""],["12505-00","1. Aktiva Lancar","1.4 Persediaan","Persediaan Barang Bar",0,""],["12506-00","1. Aktiva Lancar","1.4 Persediaan","Persediaan Barang Kemasan",0,""],["12507-00","1. Aktiva Lancar","1.4 Persediaan","Persediaan Barang lainnya",0,""],["13500-00","1. Aktiva Lancar","1.5 Beban Dibayar Dimuka","Prepaid",0,""],["13501-00","1. Aktiva Lancar","1.5 Beban Dibayar Dimuka","Uang Muka Sewa",0,""],["13502-00","1. Aktiva Lancar","1.5 Beban Dibayar Dimuka","Uang Muka Pembelian",0,""],["13601-00","1. Aktiva Lancar","1.5 Beban Dibayar Dimuka","Uang Muka Pajak - PPh 22",0,""],["13602-00","1. Aktiva Lancar","1.5 Beban Dibayar Dimuka","Uang Muka Pajak - PPh 23",0,""],["13603-00","1. Aktiva Lancar","1.5 Beban Dibayar Dimuka","Uang Muka Pajak - PPh 25",0,""],["15000-00","2. Aktiva Tidak Lancar","2.0 Fixed Asset","Fixed Asset",0,""],["15100-00","2. Aktiva Tidak Lancar","2.1 Tanah dan Bangunan","Tanah",0,""],["15200-00","2. Aktiva Tidak Lancar","2.1 Tanah dan Bangunan","Bangunan",0,""],["15300-00","2. Aktiva Tidak Lancar","2.2 Aktiva Tetap Lainnya","Kendaraan",7000000.0,"1/1/2026"],["15400-00","2. Aktiva Tidak Lancar","2.2 Aktiva Tetap Lainnya","Inventaris Kantor Lainnya",11010100.0,"1/1/2026"],["15500-00","2. Aktiva Tidak Lancar","2.2 Aktiva Tetap Lainnya","Inventaris Mesin Kopi",122000000.0,"1/1/2026"],["15600-00","2. Aktiva Tidak Lancar","2.2 Aktiva Tetap Lainnya","Inventaris Mesin Grinder",35900000.0,"1/1/2026"],["15700-00","2. Aktiva Tidak Lancar","2.2 Aktiva Tetap Lainnya","Inventaris Mesin Lainnya",38850420.0,"1/1/2026"],["15800-00","2. Aktiva Tidak Lancar","2.2 Aktiva Tetap Lainnya","Inventaris Furniture",42242177.0,"1/1/2026"],["15900-00","2. Aktiva Tidak Lancar","2.2 Aktiva Tetap Lainnya","Inventaris Mesin Roasting",220315000.0,"1/1/2026"],["16000-00","2. Aktiva Tidak Lancar","2.3 Akumulasi Penyusutan","Ac. Depreciation",0,""],["16200-00","2. Aktiva Tidak Lancar","2.3 Akumulasi Penyusutan","AK Penyusutan Bangunan",0,""],["16300-00","2. Aktiva Tidak Lancar","2.3 Akumulasi Penyusutan","AK Penyusutan Kendaraan",0,""],["16400-00","2. Aktiva Tidak Lancar","2.3 Akumulasi Penyusutan","AK Penyusutan Inventaris",0,""],["19000-00","2. Aktiva Tidak Lancar","2.4 Aktiva Tidak Lancar Lainnya","Others Assets",0,""],["19010-00","2. Aktiva Tidak Lancar","2.5 Investasi Jangka Panjang Lainnya","Investment",0,""],["19020-00","2. Aktiva Tidak Lancar","2.6 Aktiva Pajak Tangguhan","Deffered Tax",0,""],["20000-00","3. Kewajiban Lancar","3.1 Hutang Usaha Pihak Ketiga","Hutang Usaha",0,""],["20101-00","3. Kewajiban Lancar","3.1 Hutang Usaha Pihak Ketiga","Hutang Kepada PT Ganjar",60000000.0,"1/1/2026"],["20102-00","3. Kewajiban Lancar","3.1 Hutang Usaha Pihak Ketiga","Hutang Kepada PT KLN",0,""],["20103-00","3. Kewajiban Lancar","3.1 Hutang Usaha Pihak Ketiga","Hutang Kepada PT MNO",0,""],["20510-00","3. Kewajiban Lancar","3.2 Kewajiban Lancar Lainnya","Customer Deposit",0,""],["21500-00","3. Kewajiban Lancar","3.3 Hutang Bank","Bank Loan",0,""],["22000-00","3. Kewajiban Lancar","3.3 Hutang Pajak","Hutang Pph 21",0,""],["22101-00","3. Kewajiban Lancar","3.3 Hutang Pajak","Hutang Pph 23",0,""],["22101-00","3. Kewajiban Lancar","3.3 Hutang Pajak","Hutang PPN",0,""],["22102-00","3. Kewajiban Lancar","3.3 Hutang Pajak","Hutang PPh 25",0,""],["22500-00","3. Kewajiban Lancar","3.4 Biaya Yang Masih Harus Dibayar","Accruals",0,""],["22501-00","3. Kewajiban Lancar","3.4 Biaya Yang Masih Harus Dibayar","Accrued Gaji",0,""],["22502-00","3. Kewajiban Lancar","3.4 Biaya Yang Masih Harus Dibayar","Accrued Listrik",0,""],["23000-00","3. Kewajiban Tidak Lancar","3.5 Hutang Usaha Jangka Panjang Inter Co","Share holder loan",0,""],["30000-00","4. Modal","4.1 Modal Saham","Equity",0,""],["30010-00","4. Modal","4.1 Modal Saham","Setoran Modal Bp Ganjar",300000000.0,"1/1/2026"],["30020-00","4. Modal","4.1 Modal Saham","Setoran Modal Bapak Yogie",78342177.0,"1/1/2026"],["31000-00","4. Modal","4.2 Penarikan Modal","Penarikan Saham",0,""],["32000-00","4. Modal","4.3 Deviden","Dividen Paid",0,""],["35000-00","4. Modal","4.4 Laba Ditahan Tahun Tahun Sebelumnya","Retained Earning",88827397.83,"1/1/2026"],["40010-00","5. Pendapatan","5.1 Penjualan Barang","Penjualan",0,""],["40020-00","5. Pendapatan","5.1 Penjualan Barang","Diskon Penjualan",0,""],["40050-00","5. Pendapatan","5.1 Penjualan Barang","Retur Penjualan",0,""],["45100-00","5. Pendapatan","5.2 Pendapatan Jasa","Pendapatan Jasa",0,""],["50100-00","6. Harga Pokok Penjualan","6.1 Harga Pokok Penjualan","Harga Pokok Penjualan",0,""],["50200-00","6. Harga Pokok Penjualan","6.1 Harga Pokok Penjualan","Inventory Adjustment",0,""],["50500-00","6. Harga Pokok Penjualan","6.2 Factory Overhead","Factory Overhead",0,""],["70010-00","7. Biaya Operasional","7.1 Biaya Gaji dan Upah","Salary",0,""],["70020-00","7. Biaya Operasional","7.1 Biaya Gaji dan Upah","Bonus&THR",0,""],["70030-00","7. Biaya Operasional","7.1 Biaya Gaji dan Upah","Overtime",0,""],["70040-00","7. Biaya Operasional","7.1 Biaya Gaji dan Upah","Gaji",0,""],["70050-00","7. Biaya Operasional","7.1 Biaya Gaji dan Upah","Medical",0,""],["70060-00","7. Biaya Operasional","7.1 Biaya Gaji dan Upah","Tunjangan PPh 21",0,""],["71000-00","7. Biaya Operasional","7.2 Biaya Kantor","Office Expenses",0,""],["71010-00","7. Biaya Operasional","7.2 Biaya Kantor","Electricity",0,""],["71020-00","7. Biaya Operasional","7.2 Biaya Kantor","Telephone,Fax,e-mail",0,""],["71030-00","7. Biaya Operasional","7.2 Biaya Kantor","Printing, Stationary",0,""],["71035-00","7. Biaya Operasional","7.2 Biaya Kantor","Pos & Meterai",0,""],["71040-00","7. Biaya Operasional","7.2 Biaya Kantor","Food&Transport",0,""],["71050-00","7. Biaya Operasional","7.2 Biaya Kantor","Office Rental",0,""],["71060-00","7. Biaya Operasional","7.2 Biaya Kantor","Office Facilities",0,""],["72000-00","7. Biaya Operasional","7.3 Biaya Pemasaran","Selling & Distribution",0,""],["72010-00","7. Biaya Operasional","7.3 Biaya Pemasaran","Freight",0,""],["72020-00","7. Biaya Operasional","7.3 Biaya Pemasaran","Sample",0,""],["72030-00","7. Biaya Operasional","7.3 Biaya Pemasaran","Advertising",0,""],["72040-00","7. Biaya Operasional","7.3 Biaya Pemasaran","Komisi penjualan",0,""],["73000-00","7. Biaya Operasional","7.4 Biaya Perbaikan","Maintenance Expenses",0,""],["73010-00","7. Biaya Operasional","7.4 Biaya Perbaikan","Fuel,Oil,parking",0,""],["73020-00","7. Biaya Operasional","7.4 Biaya Perbaikan","Perbaikan Kendaraan",0,""],["73030-00","7. Biaya Operasional","7.4 Biaya Perbaikan","Perbaikan Peralatan kantor",0,""],["73040-00","7. Biaya Operasional","7.4 Biaya Perbaikan","Perbaikan Gedung",0,""],["73050-00","7. Biaya Operasional","7.4 Biaya Perbaikan","Perbaikan Mesin",0,""],["73060-00","7. Biaya Operasional","7.4 Biaya Perbaikan","Perbaikan Lainnya",0,""],["74000-00","7. Biaya Operasional","7.5 Biaya Penyusutan","Depreciation Expenses",0,""],["74010-00","7. Biaya Operasional","7.5 Biaya Penyusutan","Dep Land",0,""],["74020-00","7. Biaya Operasional","7.5 Biaya Penyusutan","Dep Building",0,""],["74030-00","7. Biaya Operasional","7.5 Biaya Penyusutan","Dep Machinary",0,""],["74040-00","7. Biaya Operasional","7.5 Biaya Penyusutan","Dep MV",0,""],["74050-00","7. Biaya Operasional","7.5 Biaya Penyusutan","Dep Office Eqpt",0,""],["79000-00","7. Biaya Operasional","7.9 Biaya Oprasional Lainnya","General Expenses",0,""],["79010-00","7. Biaya Operasional","7.9 Biaya Oprasional Lainnya","Insurance",0,""],["79020-00","7. Biaya Operasional","7.9 Biaya Oprasional Lainnya","Donation",0,""],["79030-00","7. Biaya Operasional","7.9 Biaya Oprasional Lainnya","Entertainment",0,""],["79040-00","7. Biaya Operasional","7.9 Biaya Oprasional Lainnya","Bank Charges",0,""],["79050-00","7. Biaya Operasional","7.9 Biaya Oprasional Lainnya","Others Expenses",0,""],["79060-00","7. Biaya Operasional","7.9 Biaya Oprasional Lainnya","Licences",0,""],["79070-00","7. Biaya Operasional","7.9 Biaya Oprasional Lainnya","Biaya Manajemen",0,""],["80000-00","8. Pendapatan (Biaya) Lain-Lain","8.1 Pendapatan Lain-Lain","Others Income",0,""],["80010-00","8. Pendapatan (Biaya) Lain-Lain","8.1 Pendapatan Lain-Lain","Interest Income Deposit",0,""],["80020-00","8. Pendapatan (Biaya) Lain-Lain","8.2 Biaya Lain-Lain","Pajak Jasa Giro",0,""],["85010-00","8. Pendapatan (Biaya) Lain-Lain","8.2 Biaya Lain-Lain","Interest Expenses",0,""],["85020-00","8. Pendapatan (Biaya) Lain-Lain","8.2 Biaya Lain-Lain","PL Forex",0,""],["85025-00","8. Pendapatan (Biaya) Lain-Lain","8.2 Biaya Lain-Lain","PL of Disposal FA",0,""],["85040-00","8. Pendapatan (Biaya) Lain-Lain","8.2 Biaya Lain-Lain","Tax Pinalty",0,""],["85090-00","8. Pendapatan (Biaya) Lain-Lain","8.2 Biaya Lain-Lain","Rounding",0,""],["90010-00","9. Pajak Penghasilan","9.1 Pajak Penghasilan","Provision for income Tax",0,""],["11102-00","1. Aktiva Lancar","1.3 Piutang Usaha Pihak Ketiga","Kasbon Karyawan",0,""],["12510-00","1. Aktiva Lancar","1.4 Persediaan","Pembelian",0,""]]
;

// Rebuilds Master_COA from scratch: wipes whatever is there (old schema or
// old data) and rewrites both the header row and all data rows to match
// the new structure - a straightforward ensureColumn() add-only migration
// isn't enough here since the WHOLE column layout changed, not just one
// new field.
function importCOAFromFile() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Master_COA');
    if (!sheet) return { success: false, message: 'Sheet Master_COA not found' };

    const headers = SHEET_CONFIG.Master_COA.headers;
    sheet.clear();
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    sheet.setFrozenRows(1);

    const timestamp = new Date().toISOString();
    const rows = COA_DATA.map(([coa, kat1, kat2, nama, saldo, tanggal]) => [
      coa, kat1, kat2, nama, saldo, tanggal, 'Aktif', timestamp, timestamp
    ]);
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

    return { success: true, created: rows.length };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Opening balances as of Jan 1, 2026, from the uploaded schedules -
// verified to make the balance sheet balance to the rupiah (Assets =
// Liabilities + Equity, selisih Rp 0) using these DETAILED figures rather
// than the summary Saldo Awal column in the COA file, which was stale for
// 3 accounts (Piutang Usaha, Inventory, Retained Earning).
const SALDO_AWAL_MODAL = [["1/1/2026","Setoran Modal Bp Ganjar",300000000.0],["1/1/2026","Setoran Modal Bapak Yogie",78342177.0],["1/1/2026","Retained Earning",83071902.67]];
const SALDO_AWAL_FA = [["15300-00","1/1/2026","Kendaraan",7000000.0],["15400-00","1/1/2026","Inventaris Kantor Lainnya",11010100.0],["15500-00","1/1/2026","Inventaris Mesin Kopi",122000000.0],["15600-00","1/1/2026","Inventaris Mesin Grinder",35900000.0],["15700-00","1/1/2026","Inventaris Mesin Lainnya",38850420.0],["15800-00","1/1/2026","Inventaris Furniture",42242177.0],["15900-00","1/1/2026","Inventaris Mesin Roasting",220315000.0]];
const SALDO_AWAL_HUTANG = [["01-Jan","Hutang Kepada PT Ganjar",60000000.0]];
const SALDO_AWAL_PIUTANG = [["1/1/2026","Arif (Halaman Baru)",3600000.0],["1/1/2026","Arif (Makkanya Coffee)",1350000.0],["1/1/2026","Arif (Makkanya Express)",12000000.0],["1/1/2026","Arion Caffe",1780000.0],["1/1/2026","Bar",125000.0],["1/1/2026","Herby (Hath)",725000.0],["1/1/2026","Kata Rasa",5400000.0],["1/1/2026","Kembali Ke Alam Group",16000000.0],["1/1/2026","Kopi Kita",260000.0],["1/1/2026","Kopi Popi",2080000.0],["1/1/2026","Marame Café",1900000.0],["1/1/2026","ONIX Serang (Renovaldi)",8600000.0],["1/1/2026","Eau De Coffee",2200000.0],["1/1/2026","Arif (Zui)",1295000.0],["1/1/2026","Satu Kala (Albi)",540000.0],["1/1/2026","Luang  Coffee",125000.0]];
const SALDO_AWAL_KASBANK = [["10100-00","1/1/2026","Cash on Hand-IDR",1475700.0],["10515-00","1/1/2026","Cash in Bank BCA - IDR",-71513883.0]];
const SALDO_AWAL_STOCK_DATA = [["01-Jan-26","BalmyDays Long Bar Spoon Cocktail Sendok Pengaduk Panjang 30.2cm - BD16 - Silver","Pcs",1.0,11000.0,11000.0,"Persediaan Barang Barista Tools"],["01-Jan-26","CLITON Alat Penggiling Kopi Elektrik Coffee Grinder Adjustable 1800mAh - CL18 - Black","Pcs",1.0,140900.0,140900.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Cocktail Shaker Mixer Bartender Boston Style 700ml - B0569 - Transparent","Pcs",3.0,32800.0,98400.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Dalinwell 2 in 1 Sikat Sendok Pembersih Mesin Kopi Espresso 1PCS - 8809","Pcs",2.0,18150.0,36300.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Filter Basket Portafilter Non-Pressurize Single Wall 58mm 1 Cup - Y58 - Silver","Pcs",2.0,16500.0,33000.0,"Persediaan Barang Barista Tools"],["01-Jan-26","GB Arabika Brazil Cerrado","Kg",57.0,123774.1,7055123.7,"Persediaan Barang Beans"],["01-Jan-26","GB Arabika Ciwidey Natural","Kg",27.75,134230.47,3724895.64,"Persediaan Barang Beans"],["01-Jan-26","GB Arabika Jawa Barat Asalan","Kg",28.35,90959.54,2578703.0,"Persediaan Barang Beans"],["01-Jan-26","GB Arabika Pasir Angling FW","Kg",2.0,110070.0,220140.0,"Persediaan Barang Beans"],["01-Jan-26","GB Arabika Pasir Angling Natural","Kg",2.0,154446.0,308892.0,"Persediaan Barang Beans"],["01-Jan-26","GB Arabika Semendo Natural","Kg",87.7,120011.89,10525043.0,"Persediaan Barang Beans"],["01-Jan-26","GB Flores Bajawa","Kg",28.85,149462.74,4312000.0,"Persediaan Barang Beans"],["01-Jan-26","GB Robusta Jawa Barat Asalan","Kg",47.0,74447.16,3499016.4,"Persediaan Barang Beans"],["01-Jan-26","GB Robusta Temanggung","Kg",90.5,94270.29,8531461.01,"Persediaan Barang Beans"],["01-Jan-26","Gula Aren","Liter",12.5,59952.19,749402.32,"Persediaan Barang Bar"],["01-Jan-26","Holder Tamper Portafilter Kopi Corner Mat Barista Silikon - 0310-1 - Black","Pcs",2.0,17600.0,35200.0,"Persediaan Barang Barista Tools"],["01-Jan-26","IYOUNICE Tamper Kopi Espresso Coffee Press Powder Hammer 58mm - 7IYC - Dark Brown","Pcs",3.0,11766.67,35300.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Nima Alat Penggiling Kopi Elektrik Bumbu Coffee Grinder - NM-8300 - Silver","Pcs",1.0,57500.0,57500.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Paper Filter V60 1-4 Cups 100 PCS - U102 - White","Pcs",2.0,128050.0,256100.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Powder Lemon Tea 800g","Pack",6.0,112500.0,675000.0,"Persediaan Barang Bar"],["01-Jan-26","Powder Taro 800g","Pack",5.0,153600.0,768000.0,"Persediaan Barang Bar"],["01-Jan-26","Powder Vanilla 800g","Pack",2.0,288000.0,576000.0,"Persediaan Barang Bar"],["01-Jan-26","RB Arabika Flores Bajawa","Kg",0.94,294578.51,276903.8,"Persediaan Barang Beans"],["01-Jan-26","RB Arabika Jawa Barat","Kg",2.32,79337.75,184063.58,"Persediaan Barang Beans"],["01-Jan-26","RB Arabika Natural Semendo","Kg",2.47,204175.05,504312.38,"Persediaan Barang Beans"],["01-Jan-26","RB Gayo Wine","Kg",0.85,228747.0,194435.26,"Persediaan Barang Beans"],["01-Jan-26","RB Robusta Jawa Barat","Kg",3.09,87762.91,271187.39,"Persediaan Barang Beans"],["01-Jan-26","RB Robusta Temanggung","Kg",12.0,98403.85,1180846.19,"Persediaan Barang Beans"],["01-Jan-26","Server Chemex Drip Pour Over Borosilicate Glass 200ml - SE111","Pcs",2.0,33700.0,67400.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Server Chemex Drip Pour Over with Filter 800ml - YD-KT001 - Transparent","Pcs",2.0,93200.0,186400.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Silicone Holder Mat Tamper Kopi Espresso Barista - 0310 - Black","Pcs",2.0,14200.0,28400.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Syrup Banana 750ml","Botol",12.0,71250.0,855000.0,"Persediaan Barang Bar"],["01-Jan-26","Syrup Caramel 750ml","Botol",5.0,71250.0,356250.0,"Persediaan Barang Bar"],["01-Jan-26","Syrup Hazelnut 750ml","Botol",8.0,71250.0,570000.0,"Persediaan Barang Bar"],["01-Jan-26","Syrup Kiwi 750ml","Botol",12.0,71250.0,855000.0,"Persediaan Barang Bar"],["01-Jan-26","Syrup Lemon 750ml","Botol",12.0,71250.0,855000.0,"Persediaan Barang Bar"],["01-Jan-26","Syrup Passion Fruit 750ml","Botol",12.0,71250.0,855000.0,"Persediaan Barang Bar"],["01-Jan-26","Syrup Peach 750ml","Botol",8.0,71250.0,570000.0,"Persediaan Barang Bar"],["01-Jan-26","Syrup Vanila 750ml","Botol",9.0,71250.0,641250.0,"Persediaan Barang Bar"],["01-Jan-26","Taffware Digipounds Timbangan Kopi Digital Timer Coffee Scale 5kg 0.1g - MS-K07 - Black","Pcs",1.0,56750.0,56750.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Vietnam Drip Coffee Filter Pot Saringan Kopi 124ml 7Q - LC1 - Silver","Pcs",10.0,10100.0,101000.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Wadah Ampas Kopi Espresso Knock Box Container L - Fen175 - Transparent","Pcs",4.0,22400.0,89600.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Wadah Ampas Kopi Espresso Knock Box Container XL - KB3 - Silver","Pcs",1.0,77000.0,77000.0,"Persediaan Barang Barista Tools"],["01-Jan-26","Wadah Ampas Kopi Knock Box with Portafilter Holder - MG34 - Black","Pcs",2.0,179000.0,358000.0,"Persediaan Barang Barista Tools"],["01-Jan-26","YUAN Sikat Mesin Kopi Espresso Machine Head Group Brush 58mm - Y5 - Black","Pcs",2.0,42200.0,84400.0,"Persediaan Barang Barista Tools"],["01-Jan-26","RB Gayo","",2.05,165000.0,275550.0,"Persediaan Barang Beans"],["01-Jan-26","RB Arabika Brazil Cerrado","",1.55,185000.0,286750.0,"Persediaan Barang Beans"],["01-Jan-26","Kemasan Kopi 7kg Besar Hitam Tanpa Valve","",186.0,8229.0,1530594.0,"Persediaan Barang Kemasan"],["01-Jan-26","Flat Bottom Valve 250gr","",50.0,4236.0,211800.0,"Persediaan Barang Kemasan"],["01-Jan-26","Flat Bottom Valve 500gr","",36.0,3000.0,108000.0,"Persediaan Barang Kemasan"],["01-Jan-26","Kemasan Sample","",43.0,1000.0,43000.0,"Persediaan Barang Kemasan"],["01-Jan-26","Flat Bottom Valve 1kg","",72.0,3518.0,253296.0,"Persediaan Barang Kemasan"]];

// Imports Modal, Fixed Asset, Hutang, Piutang, and Kas Bank opening
// balances into one unified Saldo_Awal table (kategori field distinguishes
// them). Safe to re-run: dedups by (kategori + nama_akun).
function importSaldoAwal() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Saldo_Awal');
    if (!sheet) return { success: false, message: 'Sheet Saldo_Awal not found' };
    const existingRows = sheet.getLastRow() > 1
      ? sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()
      : [];
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const katIdx = headers.indexOf('kategori');
    const namaIdx = headers.indexOf('nama_akun');
    const existingKeys = new Set(existingRows.map(row => (row[katIdx]||'') + '||' + (row[namaIdx]||'')));

    const toCreate = [];
    let skipped = 0;
    const addRows = (kategori, rows, coaFn, tanggalFn, namaFn, saldoFn) => {
      rows.forEach(r => {
        const nama = namaFn(r);
        const key = kategori + '||' + nama;
        if (existingKeys.has(key)) { skipped++; return; }
        toCreate.push({
          id_saldo_awal: generateId('SAW'),
          kategori: kategori,
          coa: coaFn(r),
          nama_akun: nama,
          tanggal: tanggalFn(r),
          saldo_awal: saldoFn(r)
        });
        existingKeys.add(key);
      });
    };

    addRows('Modal', SALDO_AWAL_MODAL, () => '', r => formatTanggalCell(r[0]), r => r[1], r => r[2]);
    addRows('Fixed Asset', SALDO_AWAL_FA, r => r[0], r => formatTanggalCell(r[1]), r => r[2], r => r[3]);
    addRows('Hutang', SALDO_AWAL_HUTANG, () => '', r => formatTanggalCell(r[0]), r => r[1], r => r[2]);
    addRows('Piutang', SALDO_AWAL_PIUTANG, () => '', r => formatTanggalCell(r[0]), r => r[1], r => r[2]);
    addRows('Kas Bank', SALDO_AWAL_KASBANK, r => r[0], r => formatTanggalCell(r[1]), r => r[2], r => r[3]);

    const bulkResult = bulkCreate('Saldo_Awal', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;
    return { success: true, created: created, dilewati_sudah_ada: skipped };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Imports the item-level opening stock valuation. Resolves each item to
// an existing Master_Produk entry where possible (for stock-ledger
// integration), but keeps the raw name either way since many items here
// are barista tools/merchandise never tracked as coffee production stock.
function importSaldoAwalStock() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Saldo_Awal_Stock');
    if (!sheet) return { success: false, message: 'Sheet Saldo_Awal_Stock not found' };
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) return { success: true, created: 0, message: 'Sudah pernah diimpor (' + (lastRow-1) + ' baris ada). Reset dulu kalau mau impor ulang.' };

    const produkSheet = ss.getSheetByName('Master_Produk');
    const produkLookup = {};
    if (produkSheet && produkSheet.getLastRow() > 1) {
      const produkRows = produkSheet.getRange(2, 1, produkSheet.getLastRow() - 1, 2).getValues();
      produkRows.forEach(row => { if (row[1]) produkLookup[row[1].toString().trim().toLowerCase()] = row[0]; });
    }

    const toCreate = SALDO_AWAL_STOCK_DATA.map(([tanggal, nama, satuan, qty, unitCost, totalCost, akun]) => ({
      id_saldo_stock: generateId('SAS'),
      tanggal: formatTanggalCell(tanggal),
      nama_barang: nama,
      id_produk: produkLookup[nama.toString().trim().toLowerCase()] || '',
      satuan: satuan,
      qty: qty,
      unit_cost: unitCost,
      total_cost: totalCost,
      akun: akun
    }));

    const bulkResult = bulkCreate('Saldo_Awal_Stock', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;
    const totalValue = toCreate.reduce((s, r) => s + r.total_cost, 0);
    return { success: true, created: created, total_nilai: parseFloat(totalValue.toFixed(2)) };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function resetSaldoAwalStock() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Saldo_Awal_Stock');
    if (!sheet) return { success: false, message: 'Sheet Saldo_Awal_Stock not found' };
    const lastRow = sheet.getLastRow();
    let deleted = 0;
    if (lastRow > 1) { deleted = lastRow - 1; sheet.deleteRows(2, deleted); }
    return { success: true, deleted: deleted };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Removes the earlier Sheet38-based "Stock Awal" entries from Pembelian_App
// (qty only, harga_satuan=0) - now superseded by the properly-valued
// Saldo_Awal_Stock data. Needed before importing Saldo_Awal_Stock, or stock
// quantity would be double-counted from both sources.
// Subsequent capital contributions (after the Jan 1, 2026 opening balance) -
// imported as Kas_Masuk entries tagged kode_transaksi='Modal Masuk', so
// they flow into the existing cash-in tracking while staying
// distinguishable from Piutang payments/other income for equity reporting.
const MODAL_MASUK_DATA = [
  ["04/19/2026", "M01-26", "Yogi", "Modal Tambahan", "Cash in Bank BCA - IDR", 50000000, "30020-00", "Setoran Modal Bapak Yogie", 50000000],
  ["05/12/2026", "M02-26", "Yogi", "Modal Tambahan", "Cash in Bank BCA - IDR", 31376333, "30020-00", "Setoran Modal Bapak Yogie", 31376333]
];

// Restores the specific Kas Masuk rows confirmed missing by the user
// (July 2026 Piutang payments) - dedups by invoice+amount+date so this is
// safe to re-run without creating duplicates if some rows are already
// there.
const KAS_MASUK_YANG_HILANG = [
  ['2026-07-01', 'INV1449', 'Cash on Hand-IDR', 'Osaka Hive Cafe', 320000],
  ['2026-07-02', 'INV1451', 'Cash in Bank BCA - IDR', 'Royal Social House Cafe & Resto', 7000000],
  ['2026-07-08', 'INV1446', 'Cash in Bank BCA - IDR', 'Satu Kala (Albi)', 1000000],
  ['2026-07-08', 'INV1455', 'Cash in Bank BCA - IDR', 'Satu Kala (Albi)', 600000],
  ['2026-07-08', 'INV1442', 'Cash in Bank BCA - IDR', 'Tujuh Coffee (Herby)', 625000],
  ['2026-07-10', 'INV1425', 'Cash on Hand-IDR', 'Sotaku hive', 450000],
  ['2026-07-11', 'INV1326', 'Cash on Hand-IDR', 'Warkop 1001 (Albi)', 150000],
  ['2026-07-11', 'INV1326', 'Cash on Hand-IDR', 'Warkop 1001 (Albi)', 155000],
  ['2026-07-13', 'INV1463', 'Cash on Hand-IDR', 'Satu Kala (Albi)', 800000],
  ['2026-07-18', 'INV1402', 'Cash in Bank BCA - IDR', 'Bintang Putra Pratama', 2700000]
];
// Records the confirmed Rp30jt debt repayment to PT Ganjar (1 June 2026) -
// found in the reference GL file early in this project, but the actual
// transaction was never entered into the live data; only the "Pembayaran
// Hutang" mechanism to record such payments was built. Dedups by
// no_dokumen so it's safe to re-run.
// One-time catch-up for existing Penjualan_App rows with total_bayar
// already filled in (from before the auto-create logic in
// submitPenjualan() existed) - creates the matching Kas_Masuk entry for
// each invoice that doesn't already have one. Only needs to run ONCE;
// every NEW sale from now on gets its Kas Masuk created automatically.
// Dedups by matching no_invoice_ref/no_dokumen against existing Kas_Masuk
// rows, so it's safe to re-run without creating duplicates.
function backfillKasMasukFromTotalBayar() {
  try {
    const penjualanAll = getAll('Penjualan_App');
    const kasMasukAll = getAll('Kas_Masuk');
    if (!penjualanAll.success) return penjualanAll;

    const alreadyLinked = new Set();
    if (kasMasukAll.success) {
      kasMasukAll.data.forEach(r => {
        const ref = (r.no_invoice_ref || '').toString().trim();
        const dok = (r.no_dokumen || '').toString().trim();
        if (ref) alreadyLinked.add(ref);
        if (dok) alreadyLinked.add(dok);
      });
    }

    // One row per invoice - total_bayar is expected to repeat the same
    // value across every line-item row of that invoice (unlike total/
    // total_tagihan, which turned out to vary per row for some historical
    // invoices), so the first non-zero value seen is used.
    const invoiceMap = {};
    penjualanAll.data.forEach(r => {
      if ((r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample') return;
      const inv = (r.no_invoice || '').toString().trim();
      const totalBayar = parseFloat(r.total_bayar) || 0;
      if (!inv || totalBayar <= 0 || invoiceMap[inv]) return;
      invoiceMap[inv] = { no_invoice: inv, customer: r.customer, salesman: r.salesman, tanggal: r.tanggal, type_pembayaran: r.type_pembayaran, total_bayar: totalBayar };
    });

    const toCreate = [];
    let dilewati = 0;
    Object.values(invoiceMap).forEach(inv => {
      if (alreadyLinked.has(inv.no_invoice)) { dilewati++; return; }
      const cashAccount = resolveCashAccount(inv.type_pembayaran) === COA_KAS ? 'Cash on Hand-IDR' : 'Cash in Bank BCA - IDR';
      toCreate.push({
        id_kas: generateId('KAS'),
        tanggal: inv.tanggal,
        sales: inv.salesman || '',
        no_dokumen: inv.no_invoice,
        cash_account: cashAccount,
        kode_transaksi: 'Piutang Usaha',
        lawan_transaksi: inv.customer || '',
        no_invoice_ref: inv.no_invoice,
        status: 'Lunas',
        kas_masuk: inv.total_bayar,
        keterangan: 'Backfill otomatis dari total_bayar Penjualan_App'
      });
    });

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const bulkResult = bulkCreate('Kas_Masuk', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;
    return { success: true, created: created, dilewati_sudah_ada: dilewati, total_invoice_dengan_total_bayar: Object.keys(invoiceMap).length };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importPembayaranHutangGanjar() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Pembelian_App');
    if (!sheet) return { success: false, message: 'Sheet Pembelian_App not found' };
    const lastRow = sheet.getLastRow();
    const existingRows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues() : [];
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const dokIdx = headers.indexOf('no_dokumen');
    const noDokumen = 'PH-GANJAR-2026-06-01';
    const alreadyExists = existingRows.some(row => (row[dokIdx] || '').toString().trim() === noDokumen);
    if (alreadyExists) return { success: true, created: 0, message: 'Sudah ada, dilewati.' };

    const data = {
      id_pembelian: generateId('PEM'),
      tanggal: '2026-06-01',
      cost_center: 'Q.Co',
      salesman: 'Ganjar',
      no_dokumen: noDokumen,
      kode_transaksi: 'Pembayaran Hutang',
      coa: 'Hutang Kepada PT Ganjar',
      nama_supplier: 'PT Ganjar',
      nama_barang: 'Pembayaran cicilan hutang',
      id_produk: '',
      jumlah: 1,
      harga_satuan: 30000000,
      total: 30000000,
      kode_lot: '',
      notes: 'Dipulihkan dari referensi GL - pembayaran hutang PT Ganjar 1 Juni 2026',
      status_bayar: 'Lunas Transfer',
      tanggal_pembayaran: '2026-06-01'
    };
    const result = create('Pembelian_App', data);
    return { success: true, created: 1, id: data.id_pembelian };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importKasMasukYangHilang() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Kas_Masuk');
    if (!sheet) return { success: false, message: 'Sheet Kas_Masuk not found' };
    const lastRow = sheet.getLastRow();
    const existingRows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues() : [];
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const invIdx = headers.indexOf('no_invoice_ref');
    const jumlahIdx = headers.indexOf('kas_masuk');
    const tglIdx = headers.indexOf('tanggal');
    const existingKeys = new Set(existingRows.map(row => {
      const tgl = row[tglIdx] instanceof Date ? formatTanggalCell(row[tglIdx]) : (row[tglIdx] || '').toString();
      return (row[invIdx] || '') + '||' + (row[jumlahIdx] || '') + '||' + tgl;
    }));

    const toCreate = [];
    let skipped = 0;
    KAS_MASUK_YANG_HILANG.forEach(([tanggal, invoice, cashAccount, customer, jumlah]) => {
      const key = invoice + '||' + jumlah + '||' + tanggal;
      if (existingKeys.has(key)) { skipped++; return; }
      toCreate.push({
        id_kas: generateId('KAS'),
        tanggal: tanggal,
        sales: 'Q.co',
        no_dokumen: '',
        cash_account: cashAccount,
        kode_transaksi: 'Piutang Usaha',
        lawan_transaksi: customer,
        no_invoice_ref: invoice,
        status: 'Lunas',
        kas_masuk: jumlah,
        keterangan: 'Dipulihkan dari data yang sempat hilang'
      });
    });
    const bulkResult = bulkCreate('Kas_Masuk', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;
    return { success: true, created: created, dilewati_sudah_ada: skipped };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importModalMasuk() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Kas_Masuk');
    if (!sheet) return { success: false, message: 'Sheet Kas_Masuk not found' };
    const existingRows = sheet.getLastRow() > 1
      ? sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()
      : [];
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const noDokIdx = headers.indexOf('no_dokumen');
    const existingNoDok = new Set(existingRows.map(row => (row[noDokIdx] || '').toString()));

    const toCreate = [];
    let skipped = 0;
    MODAL_MASUK_DATA.forEach(([tanggal, no, nama, keterangan, akunDebit, debit, kodeAkunModal, akunKredit, kredit]) => {
      if (existingNoDok.has(no)) { skipped++; return; }
      toCreate.push({
        id_kas: generateId('KAS'),
        tanggal: formatTanggalCell(tanggal),
        sales: nama,
        no_dokumen: no,
        cash_account: akunDebit,
        kode_transaksi: 'Modal Masuk',
        lawan_transaksi: kodeAkunModal + ' - ' + akunKredit,
        no_invoice_ref: '',
        status: 'Lunas',
        kas_masuk: kredit,
        keterangan: keterangan
      });
    });

    const bulkResult = bulkCreate('Kas_Masuk', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;
    return { success: true, created: created, dilewati_sudah_ada: skipped };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function resetStokAwalLama() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Pembelian_App');
    if (!sheet) return { success: false, message: 'Sheet Pembelian_App not found' };
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: true, deleted: 0 };
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const kodeIdx = headers.indexOf('kode_transaksi');
    if (kodeIdx === -1) return { success: false, message: 'Kolom kode_transaksi tidak ditemukan' };
    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    let deleted = 0;
    // Delete bottom-up so row indices don't shift under us mid-loop.
    for (let i = data.length - 1; i >= 0; i--) {
      if ((data[i][kodeIdx] || '').toString().trim() === 'Stock Awal') {
        sheet.deleteRow(i + 2);
        deleted++;
      }
    }
    return { success: true, deleted: deleted };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importStokAwal() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const produkSheet = ss.getSheetByName('Master_Produk');
    const produkLookup = {};
    if (produkSheet && produkSheet.getLastRow() > 1) {
      const produkRows = produkSheet.getRange(2, 1, produkSheet.getLastRow() - 1, 2).getValues();
      produkRows.forEach(row => { if (row[1]) produkLookup[row[1].toString().trim().toLowerCase()] = row[0]; });
    }

    const pembelianSheet = ss.getSheetByName('Pembelian_App');
    const existingRows = pembelianSheet.getLastRow() > 1
      ? pembelianSheet.getRange(2, 1, pembelianSheet.getLastRow() - 1, pembelianSheet.getLastColumn()).getValues()
      : [];
    const pHeaders = pembelianSheet.getRange(1, 1, 1, pembelianSheet.getLastColumn()).getValues()[0];
    const kodeIdx = pHeaders.indexOf('kode_transaksi');
    const namaIdx = pHeaders.indexOf('nama_barang');
    // Dedup by nama_barang among existing Stock Awal rows, so this is safe
    // to re-run without creating duplicates.
    const alreadyImported = new Set(
      (kodeIdx !== -1 && namaIdx !== -1)
        ? existingRows.filter(row => (row[kodeIdx] || '').toString() === 'Stock Awal').map(row => (row[namaIdx] || '').toString().trim().toLowerCase())
        : []
    );

    const toCreate = [];
    let skipped = 0;
    STOK_AWAL_DATA.forEach(([nama, jumlah]) => {
      const namaLower = nama.trim().toLowerCase();
      if (alreadyImported.has(namaLower)) { skipped++; return; }
      const idProduk = produkLookup[namaLower] || '';
      toCreate.push({
        id_pembelian: generateId('PEM'),
        tanggal: '2025-12-10',
        cost_center: '',
        salesman: '',
        no_dokumen: 'STOK-AWAL',
        kode_transaksi: 'Stock Awal',
        coa: '',
        nama_supplier: 'Saldo Awal',
        nama_barang: nama,
        id_produk: idProduk,
        jumlah: jumlah,
        harga_satuan: 0,
        total: 0,
        kode_lot: '',
        notes: 'Stock awal per 10 Des 2025',
        status_bayar: 'Lunas',
        tanggal_pembayaran: '2025-12-10'
      });
    });

    const bulkResult = bulkCreate('Pembelian_App', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;

    return { success: true, created: created, dilewati_sudah_ada: skipped, total_item_di_file: STOK_AWAL_DATA.length };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importPembelianHistoris() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.pembelian);
    if (!sourceSheet) return { success: false, message: 'Source sheet "Pembelian" not found' };

    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, created: 0, skipped_existing: 0 };

    const headers = data[0];
    const col = name => findColIndex(headers, name);
    const idx = {
      tanggal: col('Tanggal'),
      costCenter: col('Cost Center'),
      salesman: col('Salesman'),
      noDokumen: col('No Dokumen'),
      kodeTransaksi: col('Kode Transaksi'),
      coa: col('COA Expenses'),
      supplier: col('Nama Supplier'),
      namaBarang: col('Nama Barang'),
      notes: col('Notes'),
      jumlah: col('Jumlah'),
      hargaSatuan: col('Harga Satuan'),
      total: col('Total'),
      statusBayar: col('Status Bayar'),
      tanggalBayar: col('Tanggal Pembayaran'),
      kodeLot: findColIndexStartsWith(headers, 'Kode LOT')
    };
    if (idx.noDokumen === -1 || idx.namaBarang === -1) {
      return { success: false, message: 'Kolom "No Dokumen"/"Nama Barang" tidak ditemukan di sheet Pembelian' };
    }

    // Resolve Nama Barang -> id_produk so future average-price lookups can
    // match by code (falls back to name match anyway if this misses).
    const produkSheet = ss.getSheetByName('Master_Produk');
    const produkLookup = {};
    if (produkSheet && produkSheet.getLastRow() > 1) {
      const produkRows = produkSheet.getRange(2, 1, produkSheet.getLastRow() - 1, 2).getValues();
      produkRows.forEach(row => { if (row[1]) produkLookup[row[1].toString().trim().toLowerCase()] = row[0]; });
    }

    const pembelianSheet = ss.getSheetByName('Pembelian_App');
    const existingRows = pembelianSheet.getLastRow() > 1
      ? pembelianSheet.getRange(2, 1, pembelianSheet.getLastRow() - 1, pembelianSheet.getLastColumn()).getValues()
      : [];
    const pHeaders = pembelianSheet.getRange(1, 1, 1, pembelianSheet.getLastColumn()).getValues()[0];
    const pIdx = {
      sumberBaris: pHeaders.indexOf('sumber_baris')
    };
    const existingSourceRows = new Set(
      pIdx.sumberBaris !== -1 ? existingRows.map(row => row[pIdx.sumberBaris]).filter(v => v !== '' && v !== undefined && v !== null) : []
    );

    let skipped = 0, skippedBlank = 0;
    const toCreate = [];
    for (let i = 1; i < data.length; i++) {
      const sourceRow = i + 1;
      const noDok = (data[i][idx.noDokumen] || '').toString().trim();
      let namaBarang = (data[i][idx.namaBarang] || '').toString().trim();
      // "Pembelian Biaya" rows (payroll, sales commission, etc.) legitimately
      // have no item name - they're not a material purchase. Fall back to
      // Notes, then Nama Supplier (the actual person's name on payroll rows -
      // more specific than the generic COA label), then COA Expenses as a
      // last resort. Only skip if there's truly nothing to describe the row.
      if (!namaBarang) {
        const notes = idx.notes !== -1 ? (data[i][idx.notes] || '').toString().trim() : '';
        const supplier = idx.supplier !== -1 ? (data[i][idx.supplier] || '').toString().trim() : '';
        const coa = idx.coa !== -1 ? (data[i][idx.coa] || '').toString().trim() : '';
        namaBarang = notes || supplier || coa;
      }
      if (!namaBarang) { skippedBlank++; continue; }
      // Dedup by exact source row number - see comment in
      // importAssemblyHistoris for why content-based keys are unsafe here
      // (blank No Dokumen + a generic fallback description + a recurring
      // amount, like monthly payroll, collided across different months).
      if (existingSourceRows.has(sourceRow)) { skipped++; continue; }

      const jumlah = parseFloat(data[i][idx.jumlah]) || 0;
      const hargaSatuan = parseFloat(data[i][idx.hargaSatuan]) || 0;

      const idProduk = produkLookup[namaBarang.toLowerCase()] || '';
      toCreate.push({
        id_pembelian: generateId('PEM'),
        tanggal: formatTanggalCell(data[i][idx.tanggal]),
        cost_center: data[i][idx.costCenter] || '',
        salesman: data[i][idx.salesman] || '',
        no_dokumen: noDok,
        kode_transaksi: data[i][idx.kodeTransaksi] || '',
        coa: data[i][idx.coa] || '',
        nama_supplier: data[i][idx.supplier] || '',
        nama_barang: namaBarang,
        id_produk: idProduk,
        jumlah: jumlah,
        harga_satuan: hargaSatuan,
        total: parseFloat(data[i][idx.total]) || 0,
        kode_lot: idx.kodeLot !== -1 ? (data[i][idx.kodeLot] || '').toString() : '',
        notes: 'Import historis dari sheet Pembelian',
        status_bayar: data[i][idx.statusBayar] || '',
        tanggal_pembayaran: idx.tanggalBayar !== -1 ? formatTanggalCell(data[i][idx.tanggalBayar]) : '',
        sumber_baris: sourceRow
      });
      existingSourceRows.add(sourceRow);
    }

    const bulkResult = bulkCreate('Pembelian_App', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;

    return { success: true, created: created, skipped_existing: skipped, skipped_blank_nama_barang: skippedBlank, total_baris_sumber: data.length - 1 };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function importProduk(ss, timestamp) {
  try {
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.produk);
    if (!sourceSheet) return { table: 'Master_Produk', success: false, message: 'Source sheet not found' };

    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { table: 'Master_Produk', success: true, count: 0 };

    const headers = data[0];
    const typeIdx = headers.indexOf('Type');
    const catIdx = headers.indexOf('Katagori');
    const kodeIdx = headers.indexOf('Kode');
    const namaIdx = headers.indexOf('Nama Barang');

    if (typeIdx === -1 || kodeIdx === -1 || namaIdx === -1) {
      return { table: 'Master_Produk', success: false, message: 'Required columns not found' };
    }

    const masterSheet = ss.getSheetByName('Master_Produk');
    const existingKodes = masterSheet.getLastRow() > 1 
      ? masterSheet.getRange(2, 1, masterSheet.getLastRow() - 1, 1).getValues().flat()
      : [];

    let count = 0;
    const seenKodes = new Set(existingKodes.filter(k => k));

    for (let i = 1; i < data.length; i++) {
      const kode = data[i][kodeIdx];
      if (!kode || seenKodes.has(kode)) continue;
      seenKodes.add(kode);
      const nama = data[i][namaIdx] || '';
      const tipe = data[i][typeIdx] || 'Lainnya';
      const kategori = catIdx !== -1 ? (data[i][catIdx] || 'Lainnya') : 'Lainnya';
      const satuan = /250|500|1000/.test(nama.toString()) ? 'pcs' : 'kg';

      masterSheet.appendRow([kode, nama, tipe, kategori, satuan, 0, 0, 0, 0, 'Aktif', timestamp, timestamp]);
      count++;
    }
    return { table: 'Master_Produk', success: true, count: count };
  } catch (e) {
    return { table: 'Master_Produk', success: false, message: e.toString() };
  }
}

function importResep(ss, timestamp) {
  try {
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.resep);
    if (!sourceSheet) return { table: 'Master_Resep', success: false, message: 'Source sheet not found' };

    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { table: 'Master_Resep', success: true, count: 0 };

    const headers = data[0];
    const roastIdx = headers.indexOf('Roast');
    const romIdx = headers.indexOf('ROM');
    const kompIdx = headers.indexOf('Komposisi');

    if (roastIdx === -1 || romIdx === -1 || kompIdx === -1) {
      return { table: 'Master_Resep', success: false, message: 'Required columns not found' };
    }

    // Look up nama_produk -> id_produk so each resep row can be linked to
    // its finished product (id_produk_jadi). importProduk() already ran
    // before importResep() in importFromSheet(), so Master_Produk is populated.
    const produkSheet = ss.getSheetByName('Master_Produk');
    const produkLookup = {};
    if (produkSheet && produkSheet.getLastRow() > 1) {
      const produkRows = produkSheet.getRange(2, 1, produkSheet.getLastRow() - 1, 2).getValues();
      produkRows.forEach(row => {
        const kode = row[0], nama = row[1];
        if (nama) produkLookup[nama.toString().trim().toLowerCase()] = kode;
      });
    }
    // Exact match only (case-insensitive, trimmed). A substring fallback was
    // tried here before but it paired unrelated recipes/products whenever
    // one name happened to contain another - wrong matches are worse than
    // no match. Anything that doesn't match exactly stays unmapped and can
    // be fixed deliberately from the "Resep Mapping" tab.
    function resolveIdProdukJadi(roastName) {
      const key = roastName.toString().trim().toLowerCase();
      if (!key) return '';
      return produkLookup[key] || '';
    }

    const masterSheet = ss.getSheetByName('Master_Resep');
    const existingRows = masterSheet.getLastRow() > 1
      ? masterSheet.getRange(2, 1, masterSheet.getLastRow() - 1, masterSheet.getLastColumn()).getValues()
      : [];

    // This import can be re-run manually (action=importFromSheet) to pick up
    // sheet edits. Without dedup it would append every row again each time.
    // Key on (roast + bahan) so re-runs either skip an unchanged row or
    // self-heal its id_produk_jadi if it was blank and can now be resolved
    // (e.g. after Master_Produk was updated) - never duplicate it.
    const existingIndexByKey = {};
    existingRows.forEach((row, idx) => {
      const key = (row[1] || '').toString().trim().toLowerCase() + '||' + (row[3] || '').toString().trim().toLowerCase();
      existingIndexByKey[key] = idx;
    });

    let startId = existingRows.length;
    let added = 0;
    let healed = 0;

    for (let i = 1; i < data.length; i++) {
      const roast = data[i][roastIdx];
      const rom = data[i][romIdx];
      const komposisi = data[i][kompIdx];
      if (!roast || !rom) continue;

      const key = roast.toString().trim().toLowerCase() + '||' + rom.toString().trim().toLowerCase();
      const idProdukJadi = resolveIdProdukJadi(roast);

      if (existingIndexByKey.hasOwnProperty(key)) {
        const rowIdx = existingIndexByKey[key];
        const currentIdProdukJadi = existingRows[rowIdx][2];
        if (!currentIdProdukJadi && idProdukJadi) {
          const sheetRow = rowIdx + 2;
          masterSheet.getRange(sheetRow, 3).setValue(idProdukJadi); // id_produk_jadi column
          masterSheet.getRange(sheetRow, 9).setValue(timestamp); // updated_at column
          healed++;
        }
        continue;
      }

      startId++;
      masterSheet.appendRow(['RSP' + startId.toString().padStart(4, '0'), roast, idProdukJadi, rom, komposisi, 'kg', 'Aktif', timestamp, timestamp]);
      existingIndexByKey[key] = existingRows.length + added;
      added++;
    }
    return { table: 'Master_Resep', success: true, count: added, healed_id_produk_jadi: healed };
  } catch (e) {
    return { table: 'Master_Resep', success: false, message: e.toString() };
  }
}

function importSuppliers(ss, timestamp) {
  try {
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.pembelian);
    if (!sourceSheet) return { table: 'Master_Supplier', success: false, message: 'Source sheet not found' };

    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { table: 'Master_Supplier', success: true, count: 0 };

    const headers = data[0];
    const suppIdx = headers.indexOf('Nama Supplier');
    if (suppIdx === -1) return { table: 'Master_Supplier', success: false, message: 'Column not found' };

    const masterSheet = ss.getSheetByName('Master_Supplier');
    const existingNames = masterSheet.getLastRow() > 1 
      ? masterSheet.getRange(2, 2, masterSheet.getLastRow() - 1, 1).getValues().flat()
      : [];

    let count = 0;
    const seen = new Set(existingNames.filter(n => n));
    let startId = existingNames.length;

    for (let i = 1; i < data.length; i++) {
      const name = data[i][suppIdx];
      if (!name || seen.has(name)) continue;
      seen.add(name);
      startId++;
      masterSheet.appendRow(['SUP' + startId.toString().padStart(4, '0'), name, '', '', '', 'Aktif', timestamp, timestamp]);
      count++;
    }
    return { table: 'Master_Supplier', success: true, count: count };
  } catch (e) {
    return { table: 'Master_Supplier', success: false, message: e.toString() };
  }
}

function importCustomers(ss, timestamp) {
  try {
    const masterSheet = ss.getSheetByName('Master_Customer');
    const existingNames = masterSheet.getLastRow() > 1 
      ? masterSheet.getRange(2, 2, masterSheet.getLastRow() - 1, 1).getValues().flat()
      : [];
    const seen = new Set(existingNames.filter(n => n));
    let startId = existingNames.length;
    let count = 0;

    const kasSheet = ss.getSheetByName(SOURCE_SHEETS.kasMasuk);
    if (kasSheet) {
      const kasData = kasSheet.getDataRange().getValues();
      const kasHeaders = kasData[0];
      const lawanIdx = kasHeaders.indexOf('Lawan Transaksi');
      if (lawanIdx !== -1) {
        for (let i = 1; i < kasData.length; i++) {
          const name = kasData[i][lawanIdx];
          if (!name || seen.has(name)) continue;
          seen.add(name);
          startId++;
          masterSheet.appendRow(['CUS' + startId.toString().padStart(4, '0'), name, '', '', '', 'Aktif', timestamp, timestamp]);
          count++;
        }
      }
    }

    const penjSheet = ss.getSheetByName(SOURCE_SHEETS.penjualan);
    if (penjSheet) {
      const penjData = penjSheet.getDataRange().getValues();
      const penjHeaders = penjData[0];
      let custIdx = -1;
      for (let h = 0; h < penjHeaders.length; h++) {
        if (penjHeaders[h] && penjHeaders[h].toString().toLowerCase().includes('customer')) {
          custIdx = h; break;
        }
      }
      if (custIdx === -1 && penjHeaders.length > 7) custIdx = 7;
      if (custIdx !== -1) {
        for (let i = 1; i < penjData.length; i++) {
          const name = penjData[i][custIdx];
          if (!name || seen.has(name)) continue;
          seen.add(name);
          startId++;
          masterSheet.appendRow(['CUS' + startId.toString().padStart(4, '0'), name, '', '', '', 'Aktif', timestamp, timestamp]);
          count++;
        }
      }
    }
    return { table: 'Master_Customer', success: true, count: count };
  } catch (e) {
    return { table: 'Master_Customer', success: false, message: e.toString() };
  }
}

function importSalesmen(ss, timestamp) {
  try {
    const masterSheet = ss.getSheetByName('Master_Salesman');
    const existingNames = masterSheet.getLastRow() > 1 
      ? masterSheet.getRange(2, 2, masterSheet.getLastRow() - 1, 1).getValues().flat()
      : [];
    const seen = new Set(existingNames.filter(n => n));
    let startId = existingNames.length;
    let count = 0;

    ['pembelian', 'penjualan', 'kasMasuk'].forEach(source => {
      const sheet = ss.getSheetByName(SOURCE_SHEETS[source]);
      if (!sheet) return;
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const salesIdx = headers.indexOf(source === 'kasMasuk' ? 'Sales' : 'Salesman');
      if (salesIdx === -1) return;
      for (let i = 1; i < data.length; i++) {
        const name = data[i][salesIdx];
        if (!name || seen.has(name)) continue;
        seen.add(name);
        startId++;
        masterSheet.appendRow(['SAL' + startId.toString().padStart(4, '0'), name, '', '', 'Aktif', timestamp, timestamp]);
        count++;
      }
    });
    return { table: 'Master_Salesman', success: true, count: count };
  } catch (e) {
    return { table: 'Master_Salesman', success: false, message: e.toString() };
  }
}

function importCOA(ss, timestamp) {
  try {
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.pembelian);
    if (!sourceSheet) return { table: 'Master_COA', success: false, message: 'Source sheet not found' };

    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { table: 'Master_COA', success: true, count: 0 };

    const headers = data[0];
    const coaIdx = headers.indexOf('COA Expenses');
    if (coaIdx === -1) return { table: 'Master_COA', success: false, message: 'Column not found' };

    const masterSheet = ss.getSheetByName('Master_COA');
    const existingNames = masterSheet.getLastRow() > 1 
      ? masterSheet.getRange(2, 2, masterSheet.getLastRow() - 1, 1).getValues().flat()
      : [];

    let count = 0;
    const seen = new Set(existingNames.filter(n => n));
    let startId = existingNames.length;

    for (let i = 1; i < data.length; i++) {
      const name = data[i][coaIdx];
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const tipe = /Gaji|Biaya|Perbaikan|Office|Food|Komisi|Electricity|Pos|Inventaris|Printing|Stationary/.test(name) ? 'Beban' : 'Persediaan';
      startId++;
      masterSheet.appendRow(['COA' + startId.toString().padStart(4, '0'), name, tipe, 'Aktif', timestamp, timestamp]);
      count++;
    }
    return { table: 'Master_COA', success: true, count: count };
  } catch (e) {
    return { table: 'Master_COA', success: false, message: e.toString() };
  }
}

function importCashAccounts(ss, timestamp) {
  try {
    const sourceSheet = ss.getSheetByName(SOURCE_SHEETS.kasMasuk);
    if (!sourceSheet) return { table: 'Master_CashAccount', success: false, message: 'Source sheet not found' };

    const data = sourceSheet.getDataRange().getValues();
    if (data.length <= 1) return { table: 'Master_CashAccount', success: true, count: 0 };

    const headers = data[0];
    const cashIdx = headers.indexOf('Cash Account');
    if (cashIdx === -1) return { table: 'Master_CashAccount', success: false, message: 'Column not found' };

    const masterSheet = ss.getSheetByName('Master_CashAccount');
    const existingNames = masterSheet.getLastRow() > 1 
      ? masterSheet.getRange(2, 2, masterSheet.getLastRow() - 1, 1).getValues().flat()
      : [];

    let count = 0;
    const seen = new Set(existingNames.filter(n => n));
    let startId = existingNames.length;

    for (let i = 1; i < data.length; i++) {
      const name = data[i][cashIdx];
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const tipe = /Hand/.test(name) ? 'Kas' : 'Bank';
      startId++;
      masterSheet.appendRow(['CASH' + startId.toString().padStart(4, '0'), name, tipe, 0, 'Aktif', timestamp, timestamp]);
      count++;
    }
    return { table: 'Master_CashAccount', success: true, count: count };
  } catch (e) {
    return { table: 'Master_CashAccount', success: false, message: e.toString() };
  }
}

// ============================================================
// JSONP RESPONSE HELPERS (NO CORS)
// ============================================================
// ============================================================
// ADMIN AUTH
// ============================================================
// Password-gated access to financial reports (Neraca, Rugi Laba, Buku
// Besar) - verified server-side via a time-limited token (CacheService),
// not just hidden in the UI, so it's a real access boundary rather than
// cosmetic. Set the admin password once via RUN_SetAdminPassword (edit
// the password value in that function first, then run it from the Apps
// Script editor - this happens outside the web app entirely, so there's
// no chicken-and-egg problem setting the very first password).
const ADMIN_PROTECTED_ACTIONS = new Set([
  'generateNeracaReport', 'generateRugiLabaReportDetailed', 'getBukuBesar',
  // Same underlying financial data, exposed via the diagnostic/debug
  // tools built while troubleshooting - protected too, otherwise they'd
  // be a backdoor around the report-level protection above.
  'verifyNeracaBalance', 'debugGLImbalance', 'debugNeracaRowCoverage',
  'debugStatusBayar', 'debugKasBankMapping', 'debugAnehPenjualan', 'debugPenjualanKasPairing', 'debugHppPerProduk', 'debugSaldoAwalPiutangStatus', 'getRingkasanKasBank',
  'generatePiutangReconciliation', 'generateHutangReconciliation', 'debugInvoiceDetail', 'debugAllInvoiceMismatches',
  'generatePiutangReconciliationSummary', 'generateHutangReconciliationSummary'
]);

function verifyAdminPassword(password) {
  try {
    const stored = PropertiesService.getScriptProperties().getProperty('admin_password');
    if (!stored) return { success: false, message: 'Password admin belum diset. Jalankan RUN_SetAdminPassword dulu di Apps Script editor.' };
    if ((password || '').toString() !== stored) return { success: false, message: 'Password salah.' };
    const token = Utilities.getUuid();
    CacheService.getScriptCache().put('admin_token_' + token, 'valid', 21600); // 6 hours
    return { success: true, token: token };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function checkAdminToken(token) {
  if (!token) return false;
  try {
    return CacheService.getScriptCache().get('admin_token_' + token.toString()) === 'valid';
  } catch (e) {
    return false;
  }
}

// Edit the password below, then run this once from the Apps Script
// editor (Run button, not the web app) to set/change the admin password.
function RUN_SetAdminPassword() {
  const password = 'GANTI_PASSWORD_INI';
  if (password === 'GANTI_PASSWORD_INI') {
    return { success: false, message: 'Edit dulu nilai password di dalam fungsi RUN_SetAdminPassword sebelum menjalankan ini.' };
  }
  PropertiesService.getScriptProperties().setProperty('admin_password', password);
  return { success: true, message: 'Password admin sudah diset.' };
}

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function jsonResponse(data, callback) {
  const jsonString = JSON.stringify(data);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + jsonString + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// PARAMETER PARSER - FIX FOR GET/POST
// ============================================================
function parseParams(e) {
  let params = {};
  
  // Try POST data first
  if (e.postData && e.postData.contents) {
    try {
      const postData = JSON.parse(e.postData.contents);
      if (postData && typeof postData === 'object') {
        params = postData;
      }
    } catch (err) {
      // POST data is not JSON, try form-encoded
      if (e.parameter) {
        params = e.parameter;
      }
    }
  }
  
  // Merge with query parameters (GET overrides POST for simple params)
  if (e.parameter) {
    Object.keys(e.parameter).forEach(key => {
      params[key] = e.parameter[key];
    });
  }
  
  return params;
}

function handleRequest(e) {
  try {
    const params = parseParams(e);
    const action = params.action;
    const callback = params.callback || null;

    if (!action) {
      return jsonResponse({ success: false, message: 'Missing action parameter. Received: ' + JSON.stringify(params) }, callback);
    }

    initializeSheets();

    if (ADMIN_PROTECTED_ACTIONS.has(action) && !checkAdminToken(params.admin_token)) {
      return jsonResponse({ success: false, message: 'Akses ditolak - perlu login admin.', auth_required: true }, callback);
    }

    let result;
    switch(action) {
      case 'verifyAdminPassword': result = verifyAdminPassword(params.password); break;
      case 'getAll': result = getAll(params.table); break;
      case 'getBulk': result = getBulk(params.tables); break;
      case 'getById': result = getById(params.table, params.id); break;
      case 'getDropdown': result = getDropdown(params.table); break;
      case 'getResep': result = getResep(params.id_produk); break;
      case 'debugResep': result = debugResep(params.id_produk); break;
      case 'debugHargaBahan': result = debugHargaBahan(params.nama_bahan); break;
      case 'debugZeroPriceMaterials': result = debugZeroPriceMaterials(); break;
      case 'setHargaBeli': result = setHargaBeli(params.nama_atau_id, params.harga); break;
      case 'listResepMapping': result = listResepMapping(); break;
      case 'setResepMapping': result = setResepProdukJadiByName(params.nama_resep, params.id_produk_jadi); break;
      case 'createProdukFromResep': result = createProdukFromResep(params.nama_resep, params.tipe, params.kategori, params.satuan); break;
      case 'submitMasterData': result = submitMasterData(params.table, params); break;
      case 'getProdukByType': result = getProdukByType(params.tipe); break;
      case 'getHPP': result = getHPP(params.id_produk); break;
      case 'getStock': result = getStock(params.id_produk); break;
      case 'getAllStock': result = getAllStock(); break;
      case 'getStockBreakdown': result = getStockBreakdown(); break;
      case 'getStockTrace': result = getStockTrace(params.nama_atau_id); break;
      case 'getLaporanLR': result = getLaporanLR(params.periode); break;
      case 'getLaporanStock': result = getLaporanStock(params.tanggal); break;
      case 'create': result = create(params.table, params.data); break;
      case 'update': result = update(params.table, params.id, params.data); break;
      case 'delete': result = deleteRecord(params.table, params.id); break;
      case 'submitAssembly': result = submitAssembly(params); break;
      case 'submitPembelian': result = submitPembelian(params); break;
      case 'submitPenjualan': result = submitPenjualan(params); break;
      case 'backfillPenjualanINV': result = backfillPenjualanINV(); break;
      case 'reconcileAllInvoiceStatus': result = reconcileAllInvoiceStatus(); break;
      case 'submitKasMasuk': result = submitKasMasuk(params); break;
      case 'submitOpname': result = submitOpname(params); break;
      case 'submitMovement': result = submitMovement(params); break;
      case 'syncAll': result = syncAll(params); break;
      case 'calculateHPP': result = calculateHPP(params); break;
      case 'generateLaporanLR': result = generateLaporanLR(params); break;
      case 'generateLaporanStock': result = generateLaporanStock(params); break;
      case 'importFromSheet': result = importFromSheet(); break;
      case 'importPembelianHistoris': result = importPembelianHistoris(); break;
      case 'importStokAwal': result = importStokAwal(); break;
      case 'importCOAFromFile': result = importCOAFromFile(); break;
      case 'importSaldoAwal': result = importSaldoAwal(); break;
      case 'importSaldoAwalStock': result = importSaldoAwalStock(); break;
      case 'resetSaldoAwalStock': result = resetSaldoAwalStock(); break;
      case 'resetStokAwalLama': result = resetStokAwalLama(); break;
      case 'importModalMasuk': result = importModalMasuk(); break;
      case 'importKasMasukYangHilang': result = importKasMasukYangHilang(); break;
      case 'importPembayaranHutangGanjar': result = importPembayaranHutangGanjar(); break;
      case 'backfillKasMasukFromTotalBayar': result = backfillKasMasukFromTotalBayar(); break;
      case 'generateVirtualGL': result = generateVirtualGL(params.periode); break;
      case 'verifyNeracaBalance': result = verifyNeracaBalance(params.asOfDate); break;
      case 'debugGLImbalance': result = debugGLImbalance(); break;
      case 'debugNeracaRowCoverage': result = debugNeracaRowCoverage(); break;
      case 'debugStatusBayar': result = debugStatusBayar(); break;
      case 'debugKasBankMapping': result = debugKasBankMapping(); break;
      case 'debugAnehPenjualan': result = debugAnehPenjualan(); break;
      case 'debugPenjualanKasPairing': result = debugPenjualanKasPairing(); break;
      case 'debugHppPerProduk': result = debugHppPerProduk(); break;
      case 'debugSheetSnapshot': result = debugSheetSnapshot(); break;
      case 'debugSaldoAwalPiutangStatus': result = debugSaldoAwalPiutangStatus(); break;
      case 'getRingkasanKasBank': result = getRingkasanKasBank(); break;
      case 'generatePiutangReconciliation': result = generatePiutangReconciliation(params.customer, params.refresh === 'true'); break;
      case 'generatePiutangReconciliationSummary': result = generatePiutangReconciliationSummary(params.refresh === 'true'); break;
      case 'debugInvoiceDetail': result = debugInvoiceDetail(params.no_invoice); break;
      case 'debugAllInvoiceMismatches': result = debugAllInvoiceMismatches(); break;
      case 'generateHutangReconciliation': result = generateHutangReconciliation(params.supplier, params.refresh === 'true'); break;
      case 'generateHutangReconciliationSummary': result = generateHutangReconciliationSummary(params.refresh === 'true'); break;
      case 'fixPenjualanTypePembayaran': result = fixPenjualanTypePembayaran(); break;
      case 'getBukuBesar': result = getBukuBesar(params.refresh === 'true'); break;
      case 'generatePiutangHutangDetail': result = generatePiutangHutangDetail(); break;
      case 'generateNeracaReport': result = generateNeracaReport(); break;
      case 'generateRugiLabaReportDetailed': result = generateRugiLabaReportDetailed(); break;
      case 'migrateSampleTransaksiHistoris': result = migrateSampleTransaksiHistoris(); break;
      case 'previewSampleMigration': result = previewSampleMigration(); break;
      case 'debugPembelianImport': result = debugPembelianImport(); break;
      case 'debugPenjualanImport': result = debugPenjualanImport(); break;
      case 'debugKodeTransaksiPenjualan': result = debugKodeTransaksiPenjualan(); break;
      case 'debugSampleKemasan': result = debugSampleKemasan(); break;
      case 'fillMissingSampleKemasan': result = fillMissingSampleKemasan(); break;
      case 'generateStockMovements': result = generateStockMovementsFromHistory(); break;
      case 'getBatchesForProduk': result = getBatchesForProduk(params.id_produk); break;
      case 'getKemasanForProduk': result = getKemasanForProduk(params.id_produk); break;
      case 'generatePricelist': result = generatePricelist(params.markup_percent); break;
      case 'savePricelist': result = savePricelist(params.items, params.isFirstChunk); break;
      case 'getPricelistPrice': result = getPricelistPrice(params.id_produk); break;
      case 'backfillKemasanIds': result = backfillKemasanIds(); break;
      case 'getNextDocNumber': result = getNextDocNumber(params.table, params.field); break;
      case 'getInvoiceForPayment': result = getInvoiceForPayment(params.no_invoice); break;
      case 'getUnpaidInvoices': result = getUnpaidInvoices(); break;
      case 'debugAssemblyImport': result = debugAssemblyImport(); break;
      case 'importAssemblyHistoris': result = importAssemblyHistoris(); break;
      case 'importPenjualanHistoris': result = importPenjualanHistoris(); break;
      case 'debugKasMasukImport': result = debugKasMasukImport(); break;
      case 'importKasMasukHistoris': result = importKasMasukHistoris(); break;
      case 'syncHargaBeli': result = syncHargaBeliFromPembelian(); break;
      case 'syncHargaKemasan': result = syncHargaKemasanFromPembelian(); break;
      case 'resetInit': result = resetInit(); break;
      case 'clearLogSync': result = clearLogSync(); break;
      case 'debugSheetHeader': result = debugSheetHeader(params.sheet_name); break;
      case 'listAllSheets': result = listAllSheets(); break;
      case 'repairHeader': result = repairHeader(params.table); break;
      case 'repairRawHeader': result = repairRawHeader(params.sheet_name); break;
      case 'resetPembelian': result = resetPembelian(); break;
      case 'resetAssemblyEntry': result = resetAssemblyEntry(); break;
      case 'resetPenjualan': result = resetPenjualan(); break;
      case 'resetKasMasuk': result = resetKasMasuk(); break;
      default: result = { success: false, message: 'Unknown action: ' + action };
    }

    return jsonResponse(result, callback);
  } catch (error) {
    return jsonResponse({ success: false, message: error.toString(), stack: error.stack }, e.parameter ? e.parameter.callback : null);
  }
}

// ============================================================
// CRUD OPERATIONS
// ============================================================
function getAll(table, ss) {
  ss = ss || SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(table);
  if (!sheet) return { success: false, message: 'Sheet not found: ' + table };

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] };

  const headers = data[0];
  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  return { success: true, data: rows };
}

// Fetch several tables in ONE script execution instead of one JSONP round
// trip per table. Each getAll() previously called SpreadsheetApp.openById()
// itself, so loading N master tables meant N separate cold requests (each
// paying for its own network round trip + spreadsheet open). This opens the
// spreadsheet once and reads every requested sheet in the same execution.
function getBulk(tablesParam) {
  let tables = tablesParam;
  if (typeof tables === 'string') {
    try { tables = JSON.parse(tables); } catch (e) { tables = tables.split(','); }
  }
  if (!Array.isArray(tables) || tables.length === 0) {
    return { success: false, message: 'tables must be a non-empty array' };
  }
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const data = {};
  tables.forEach(t => { data[t] = getAll(t, ss); });
  return { success: true, data: data };
}

function getById(table, id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(table);
  if (!sheet) return { success: false, message: 'Sheet not found: ' + table };
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idField = headers.find(h => h && h.toString().startsWith('id_')) || 'id';

  const all = getAll(table);
  if (!all.success) return all;
  const idStr = (id === undefined || id === null) ? '' : id.toString().trim();
  const record = all.data.find(r => {
    const val = r[idField];
    return val !== undefined && val !== null && val.toString().trim() === idStr;
  });
  return { success: !!record, data: record || null };
}

function getDropdown(table) {
  const all = getAll(table);
  if (!all.success) return all;
  const dropdownData = all.data.map(row => ({
    value: row.id_produk || row.id_customer || row.id_supplier || row.id_salesman || row.id_coa || row.id_cash || row.id_kemasan || row.id_resep || row.id,
    label: row.nama_produk || row.nama_customer || row.nama_supplier || row.nama_salesman || row.nama_coa || row.nama_cash || row.nama_kemasan || row.nama_resep || row.nama || row[Object.keys(row)[1]]
  }));
  return { success: true, data: dropdownData };
}

// Writes many rows in a SINGLE setValues() call instead of one appendRow()
// (+ one logSync, which is itself another create()) per row. For a 480-row
// import, the old per-row create() approach meant ~1000+ separate Sheets
// API calls (open spreadsheet + read headers + append, twice per row
// counting the log entry) - easily enough to hit Apps Script's 6-minute
// execution limit. This does it in essentially one write.
function bulkCreate(table, ss, dataArray) {
  if (!dataArray || dataArray.length === 0) return { success: true, count: 0 };
  const sheet = ss.getSheetByName(table);
  if (!sheet) return { success: false, message: 'Sheet not found: ' + table };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const timestamp = new Date().toISOString();
  const idField = headers.find(h => h && h.startsWith('id_')) || 'id';

  const rows = dataArray.map(data => {
    if (!data[idField]) data[idField] = generateId(table.substring(0, 3).toUpperCase());
    if (!data.created_at) data.created_at = timestamp;
    data.updated_at = timestamp;
    return headers.map(h => (data[h] !== undefined && data[h] !== null) ? data[h] : '');
  });

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, headers.length).setValues(rows);
  return { success: true, count: rows.length };
}

function create(table, data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(table);
  if (!sheet) return { success: false, message: 'Sheet not found: ' + table };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const timestamp = new Date().toISOString();
  const idField = headers.find(h => h && h.startsWith('id_')) || 'id';
  
  if (!data[idField]) {
    data[idField] = generateId(table.substring(0, 3).toUpperCase());
  }
  data.created_at = timestamp;
  data.updated_at = timestamp;

  const row = headers.map(h => data[h] || '');
  sheet.appendRow(row);
  // IMPORTANT: never log the creation of a Log_Sync row itself, or this
  // becomes infinite recursion (create -> logSync -> create('Log_Sync') ->
  // logSync -> create('Log_Sync') -> ...). This was firing on every single
  // create() call anywhere in the app and is almost certainly the real
  // cause of the app-wide slowness, not just a frontend timeout issue.
  if (table !== 'Log_Sync') {
    logSync('CREATE', table, data[idField], 'SUCCESS');
  }
  return { success: true, data: data };
}

function update(table, id, data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(table);
  if (!sheet) return { success: false, message: 'Sheet not found: ' + table };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idField = headers.find(h => h && h.startsWith('id_')) || 'id';
  const allData = sheet.getDataRange().getValues();

  for (let i = 1; i < allData.length; i++) {
    const rowId = allData[i][headers.indexOf(idField)];
    if (rowId === id) {
      data.updated_at = new Date().toISOString();
      headers.forEach((h, idx) => {
        if (data[h] !== undefined) {
          sheet.getRange(i + 1, idx + 1).setValue(data[h]);
        }
      });
      logSync('UPDATE', table, id, 'SUCCESS');
      return { success: true, message: 'Updated successfully' };
    }
  }
  return { success: false, message: 'Record not found' };
}

function deleteRecord(table, id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(table);
  if (!sheet) return { success: false, message: 'Sheet not found: ' + table };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idField = headers.find(h => h && h.startsWith('id_')) || 'id';
  const allData = sheet.getDataRange().getValues();

  for (let i = 1; i < allData.length; i++) {
    if (allData[i][headers.indexOf(idField)] === id) {
      sheet.deleteRow(i + 1);
      logSync('DELETE', table, id, 'SUCCESS');
      return { success: true, message: 'Deleted successfully' };
    }
  }
  return { success: false, message: 'Record not found' };
}

function generateId(prefix) {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return prefix + timestamp.toString().slice(-6) + random;
}

// ============================================================
// ASSEMBLY
// ============================================================
// Resolves which purchase lot a raw material most likely came from, for a
// live Assembly submission: the closest Pembelian_App purchase of that
// material on or before the given date (falls back to the earliest
// available purchase if none predates it). See importAssemblyHistoris()
// for the same logic applied in bulk to historical data.
function resolveKodeLotForMaterial(bahanId, namaBahan, tanggal) {
  const all = getAll('Pembelian_App');
  if (!all.success) return '';
  const idStr = (bahanId || '').toString().trim();
  const namaStr = (namaBahan || '').toString().trim().toLowerCase();
  const matches = all.data.filter(d => {
    const dId = (d.id_produk || '').toString().trim();
    const dNama = (d.nama_barang || '').toString().trim().toLowerCase();
    return (idStr && dId === idStr) || dNama === namaStr;
  });
  if (matches.length === 0) return '';
  matches.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  const targetDate = new Date(tanggal);
  let best = null;
  for (const m of matches) {
    if (new Date(m.tanggal) <= targetDate) best = m; else break;
  }
  if (!best) best = matches[0];
  return best.kode_lot || '';
}

function submitAssembly(data) {
  try {
    const totalHargaMaterial = parseFloat(data.total_harga_material) || 0;
    // Overhead is no longer applied anywhere - it isn't a real recorded
    // cost (no actual electricity/rent/etc. expense backs it), so HPP is
    // material cost only. Fields are kept at 0 rather than removed from
    // the schema, for backward compatibility with existing rows/reports.
    const overheadPercent = 0;
    const overheadAmount = 0;

    let details = data.details;
    if (typeof details === 'string') {
      try { details = JSON.parse(details); } catch(e) { details = []; }
    }
    if (!details || !Array.isArray(details) || details.length === 0) {
      return { success: false, message: 'Tidak ada raw material di detail assembly' };
    }

    // Compute HPP first so it can be embedded on every row below (every row
    // is fully self-contained - no relying on "same as row above").
    const hppResult = calculateHPP({
      id_produk: data.sku,
      qty_produksi: parseFloat(data.jumlah_produksi) || 0,
      details: details,
      overhead_percent: overheadPercent
    });
    const hpp = hppResult.success ? hppResult.hpp : (parseFloat(data.hpp) || 0);

    const createdIds = [];
    details.forEach(detail => {
      const kodeLot = resolveKodeLotForMaterial(detail.raw_material_id, detail.raw_material, data.tanggal);
      const row = {
        id_assembly: generateId('ASM'),
        tanggal: data.tanggal,
        batch_no: data.batch_no,
        sku: data.sku,
        nama_barang: data.nama_barang,
        jumlah_produksi: parseFloat(data.jumlah_produksi) || 0,
        penyusutan: parseFloat(data.penyusutan) || 0,
        overhead_percent: overheadPercent,
        overhead_amount: overheadAmount,
        total_harga_material: totalHargaMaterial,
        hpp: hpp,
        raw_material: detail.raw_material,
        jumlah_raw_material: parseFloat(detail.jumlah_raw_material) || 0,
        harga_raw_material: parseFloat(detail.harga_raw_material) || 0,
        kode_lot: kodeLot,
        status: 'OK'
      };
      create('Assembly_Entry', row);
      createdIds.push(row.id_assembly);

      submitMovement({
        tanggal: data.tanggal,
        id_produk: detail.raw_material_id || detail.raw_material,
        nama_produk: detail.raw_material,
        tipe: 'Keluar',
        qty_in: 0,
        qty_out: parseFloat(detail.jumlah_raw_material) || 0,
        referensi: data.batch_no,
        keterangan: 'Assembly: ' + data.nama_barang
      });
    });

    submitMovement({
      tanggal: data.tanggal,
      id_produk: data.sku,
      nama_produk: data.nama_barang,
      tipe: 'Masuk',
      qty_in: parseFloat(data.jumlah_produksi) || 0,
      qty_out: 0,
      referensi: data.batch_no,
      keterangan: 'Hasil Assembly'
    });

    return { 
      success: true, 
      message: 'Assembly submitted successfully',
      id_assembly: createdIds[0],
      count: createdIds.length,
      hpp: hpp
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ============================================================
// PEMBELIAN
// ============================================================
// Auto-generates a Kode LOT when the frontend didn't supply one: DDMM (day+
// month of the purchase) + supplier initials (Master_Supplier has no
// dedicated short-code field, so this derives one from the first letters
// of each word in nama_supplier) + item code (id_produk). E.g. "2107-BS-GB01"
// for a July 21 purchase from "Budi Santoso" of item GB01.
function generateKodeLot(tanggal, namaSupplier, idBarang) {
  const d = tanggal ? new Date(tanggal) : new Date();
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const supplierInitials = (namaSupplier || '')
    .toString().trim().split(/\s+/)
    .map(w => w.charAt(0).toUpperCase())
    .join('')
    .slice(0, 4) || 'XX';
  const itemCode = (idBarang || '').toString().trim() || 'XX';
  return `${dd}${mm}-${supplierInitials}-${itemCode}`;
}

function submitPembelian(data) {
  try {
    let details = data.details;
    if (typeof details === 'string') {
      try { details = JSON.parse(details); } catch(e) { details = []; }
    }
    if (!details || !Array.isArray(details) || details.length === 0) {
      return { success: false, message: 'Tidak ada barang di detail pembelian' };
    }

    const createdIds = [];
    details.forEach(detail => {
      const row = {
        id_pembelian: generateId('PEM'),
        tanggal: data.tanggal,
        cost_center: data.cost_center,
        salesman: data.salesman,
        no_dokumen: data.no_dokumen,
        kode_transaksi: data.kode_transaksi,
        coa: data.coa,
        nama_supplier: data.nama_supplier,
        nama_barang: detail.nama_barang,
        id_produk: detail.id_produk || '',
        jumlah: parseFloat(detail.jumlah) || 0,
        harga_satuan: parseFloat(detail.harga_satuan) || 0,
        total: parseFloat(detail.total) || 0,
        kode_lot: detail.kode_lot || generateKodeLot(data.tanggal, data.nama_supplier, detail.id_produk),
        notes: data.notes || '',
        status_bayar: data.status_bayar || 'Hutang',
        tanggal_pembayaran: data.tanggal_pembayaran || ''
      };
      create('Pembelian_App', row);
      createdIds.push(row.id_pembelian);

      if (data.kode_transaksi === 'Pembelian') {
        submitMovement({
          tanggal: data.tanggal,
          id_produk: detail.id_produk || detail.nama_barang,
          nama_produk: detail.nama_barang,
          tipe: 'Masuk',
          qty_in: parseFloat(detail.jumlah) || 0,
          qty_out: 0,
          referensi: data.no_dokumen,
          keterangan: 'Pembelian dari ' + data.nama_supplier
        });
      }
    });

    return { success: true, id_pembelian: createdIds[0], count: createdIds.length };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * REVISI: syncPenjualanINV
 * 
 * Perubahan dari versi sebelumnya:
 * 1. total_tagihan: dari HYBRID (first || sum) → SUM (sum semua baris)
 * 2. total_bayar: dari FIRST → SUM (sum semua baris, dengan validasi)
 * 3. type_pembayaran: dari FIRST → VALIDATED FIRST (cek konsistensi)
 * 4. status: dari FIRST → VALIDATED FIRST (cek konsistensi)
 * 5. status_bayar: dari FIRST → VALIDATED FIRST (cek konsistensi)
 * 6. tanggal_pembayaran: dari FIRST → VALIDATED FIRST (cek konsistensi)
 * 7. harga_satuan: dari FIRST → BLANK (tidak dihitung, per produk berbeda)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A #1: syncPenjualanINV()
// 
// Sebelum: Payment fields diambil dari Penjualan_App (bisa inconsistent)
// Sesudah: Payment fields default Hutang/0 untuk new INV
//          Existing INV dipertahankan (tidak overwrite)
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A #1: syncPenjualanINV()
// 
// Sebelum: Payment fields diambil dari Penjualan_App (bisa inconsistent)
// Sesudah: Payment fields default Hutang/0 untuk new INV
//          Existing INV dipertahankan (tidak overwrite)
//          JUGA membaca total_bayar dari Kas_Masuk sebagai fallback
// ═══════════════════════════════════════════════════════════════════════════════
function syncPenjualanINV(noInvoice) {
  try {
    const inv = (noInvoice || '').toString().trim();
    if (!inv) return { success: false, message: 'no_invoice kosong' };

    const penjualanAll = getAll('Penjualan_App');
    if (!penjualanAll.success) return penjualanAll;

    const rows = penjualanAll.data.filter(r => (r.no_invoice || '').toString().trim() === inv);
    if (rows.length === 0) return { success: true, message: 'Tidak ada baris untuk invoice ini' };

    const first = rows[0];
    const sum = field => rows.reduce((s, r) => s + (parseFloat(r[field]) || 0), 0);

    // ═══════════════════════════════════════════════════════════════════════════
    // REVISI OPSI A: Baca juga dari Kas_Masuk untuk total_bayar yang akurat
    // ═══════════════════════════════════════════════════════════════════════════
    const kasMasukAll = getAll('Kas_Masuk');
    let totalBayarFromKas = 0;
    let typePembayaranFromKas = '';
    let statusBayarFromKas = '';

    if (kasMasukAll.success) {
      const kasPayments = kasMasukAll.data.filter(k => {
        const ref = (k.no_invoice_ref || '').toString().trim();
        const dok = (k.no_dokumen || '').toString().trim();
        return ref === inv || dok === inv;
      });

      if (kasPayments.length > 0) {
        totalBayarFromKas = kasPayments.reduce((s, k) => s + (parseFloat(k.kas_masuk) || 0), 0);
        typePembayaranFromKas = mapCashAccountToTypePembayaran(kasPayments[0].cash_account);
        statusBayarFromKas = 'Lunas';
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VALIDASI: Field yang HARUS SAMA di semua baris invoice
    // ═══════════════════════════════════════════════════════════════════════════
    const validateConsistency = (fieldName, displayName) => {
      const values = rows.map(r => (r[fieldName] || '').toString().trim());
      const uniqueValues = [...new Set(values.filter(v => v))];
      if (uniqueValues.length > 1) {
        return {
          isValid: false,
          value: values[0],
          warning: '⚠️ DATA INKONSISTEN: ' + displayName + ' berbeda antar baris invoice ' + inv + 
                   '. Nilai ditemukan: [' + uniqueValues.join(' | ') + ']. ' +
                   'Diambil: "' + values[0] + '" (baris pertama). '
        };
      }
      return { isValid: true, value: values[0] };
    };

    const typePembayaranCheck = validateConsistency('type_pembayaran', 'Type Pembayaran');
    const statusCheck = validateConsistency('status', 'Status');
    const statusBayarCheck = validateConsistency('status_bayar', 'Status Bayar');
    const tanggalPembayaranCheck = validateConsistency('tanggal_pembayaran', 'Tanggal Pembayaran');

    const warnings = [];
    if (!typePembayaranCheck.isValid) warnings.push(typePembayaranCheck.warning);
    if (!statusCheck.isValid) warnings.push(statusCheck.warning);
    if (!statusBayarCheck.isValid) warnings.push(statusBayarCheck.warning);
    if (!tanggalPembayaranCheck.isValid) warnings.push(tanggalPembayaranCheck.warning);

    // ═══════════════════════════════════════════════════════════════════════════
    // DETERMINE total_bayar: prioritaskan Kas_Masuk jika ada
    // ═══════════════════════════════════════════════════════════════════════════
    const totalBayarFromApp = sum('total_bayar');
    // REVISI: Jika Kas_Masuk punya data, gunakan itu. Jika tidak, gunakan App.
    const finalTotalBayar = totalBayarFromKas > 0 ? totalBayarFromKas : totalBayarFromApp;

    // REVISI: Jika Kas_Masuk ada, status = Lunas. Jika tidak, gunakan dari App.
    const finalStatusBayar = totalBayarFromKas > 0 ? 'Lunas' : statusBayarCheck.value;

    // REVISI: type_pembayaran dari Kas_Masuk jika ada, jika tidak dari App
    const finalTypePembayaran = typePembayaranFromKas || typePembayaranCheck.value;

    // ═══════════════════════════════════════════════════════════════════════════
    // AGREGASI
    // ═══════════════════════════════════════════════════════════════════════════
    const aggregated = {
      id_penjualan: first.id_penjualan,
      tanggal: first.tanggal,
      jatuh_tempo: first.jatuh_tempo || '',
      cost_center: first.cost_center || '',
      salesman: first.salesman || '',
      no_invoice: inv,
      kode_transaksi: first.kode_transaksi || '',
      customer: first.customer || '',
      nama_barang: rows.map(r => r.nama_barang).filter(n => n).join(', '),
      jumlah: sum('jumlah'),
      harga_satuan: '',
      total: sum('total'),
      diskon: sum('diskon'),
      total_diskon: sum('total_diskon'),
      ppn: sum('ppn'),
      pph: sum('pph'),
      kemasan: rows.map(r => r.kemasan).filter(k => k).join(', '),
      jumlah_kemasan: sum('jumlah_kemasan'),
      batch_no: rows.map(r => r.batch_no).filter(b => b).join(', '),
      total_tagihan: sum('total_tagihan') || sum('total'),
      type_pembayaran: finalTypePembayaran,
      status: statusCheck.value,
      // REVISI: total_bayar dari Kas_Masuk (prioritas) atau App
      total_bayar: finalTotalBayar,
      tanggal_pembayaran: tanggalPembayaranCheck.value,
      // REVISI: status_bayar dari Kas_Masuk (prioritas) atau App
      status_bayar: finalStatusBayar
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // UPSERT KE Penjualan_INV
    // ═══════════════════════════════════════════════════════════════════════════
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Penjualan_INV');
    if (!sheet) return { success: false, message: 'Sheet Penjualan_INV not found' };

    const lastRow = sheet.getLastRow();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const invColIdx = headers.indexOf('no_invoice');

    let existingRowNum = -1;
    if (lastRow > 1 && invColIdx !== -1) {
      const invColValues = sheet.getRange(2, invColIdx + 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < invColValues.length; i++) {
        if ((invColValues[i][0] || '').toString().trim() === inv) { 
          existingRowNum = i + 2; 
          break; 
        }
      }
    }

    const timestamp = new Date().toISOString();
    aggregated.created_at = existingRowNum === -1 ? timestamp : undefined;
    aggregated.updated_at = timestamp;
    const rowValues = headers.map(h => aggregated[h] !== undefined ? aggregated[h] : '');

    if (existingRowNum !== -1) {
      // REVISI OPSI A: JANGAN OVERWRITE payment fields yang sudah ada
      // KECUALI jika data dari Kas_Masuk lebih baru/akurat
      const createdAtIdx = headers.indexOf('created_at');
      if (createdAtIdx !== -1) rowValues[createdAtIdx] = sheet.getRange(existingRowNum, createdAtIdx + 1).getValue();

      const existingTotalBayarIdx = headers.indexOf('total_bayar');
      const existingStatusBayarIdx = headers.indexOf('status_bayar');
      const existingTipeIdx = headers.indexOf('type_pembayaran');

      // Jika ada data dari Kas_Masuk, overwrite dengan yang lebih akurat
      if (totalBayarFromKas > 0) {
        if (existingTotalBayarIdx !== -1) rowValues[existingTotalBayarIdx] = finalTotalBayar;
        if (existingStatusBayarIdx !== -1) rowValues[existingStatusBayarIdx] = finalStatusBayar;
        if (existingTipeIdx !== -1) rowValues[existingTipeIdx] = finalTypePembayaran;
      } else {
        // Jika tidak ada Kas_Masuk, pertahankan existing
        if (existingTotalBayarIdx !== -1) {
          const existingTotalBayar = sheet.getRange(existingRowNum, existingTotalBayarIdx + 1).getValue();
          if (existingTotalBayar && parseFloat(existingTotalBayar) > 0) {
            rowValues[existingTotalBayarIdx] = existingTotalBayar;
          }
        }
        if (existingStatusBayarIdx !== -1) {
          const existingStatus = sheet.getRange(existingRowNum, existingStatusBayarIdx + 1).getValue();
          if (existingStatus && existingStatus.toString().trim() !== '') {
            rowValues[existingStatusBayarIdx] = existingStatus;
          }
        }
        if (existingTipeIdx !== -1) {
          const existingTipe = sheet.getRange(existingRowNum, existingTipeIdx + 1).getValue();
          if (existingTipe && existingTipe.toString().trim() !== '') {
            rowValues[existingTipeIdx] = existingTipe;
          }
        }
      }

      sheet.getRange(existingRowNum, 1, 1, headers.length).setValues([rowValues]);
    } else {
      // Invoice BARU → default Hutang/0 (kecuali ada data dari Kas_Masuk)
      const totalBayarIdx = headers.indexOf('total_bayar');
      const statusBayarIdx = headers.indexOf('status_bayar');
      const tipeIdx = headers.indexOf('type_pembayaran');

      if (totalBayarIdx !== -1) rowValues[totalBayarIdx] = finalTotalBayar;
      if (statusBayarIdx !== -1) rowValues[statusBayarIdx] = finalStatusBayar;
      if (tipeIdx !== -1) rowValues[tipeIdx] = finalTypePembayaran;

      sheet.appendRow(rowValues);
    }

    return { 
      success: true, 
      no_invoice: inv, 
      updated_existing: existingRowNum !== -1,
      total_bayar_source: totalBayarFromKas > 0 ? 'Kas_Masuk' : 'Penjualan_App',
      total_bayar_value: finalTotalBayar,
      warnings: warnings.length > 0 ? warnings : null
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}



// One-time catch-up: builds Penjualan_INV for every invoice already in
// Penjualan_App (before this sync mechanism existed). Safe to re-run -
// syncPenjualanINV() itself upserts, so running this again just
// refreshes every invoice's aggregate rather than duplicating anything.
// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A #2: backfillPenjualanINV()
// 
// Sebelum: Baca total_bayar dari Penjualan_App (tidak akurat untuk multi-payment)
// Sesudah: Baca total_bayar dari Kas_Masuk (single source of truth)
//          Invoice yang sudah ada DIPERTAHANKAN (tidak overwrite payment fields)
// ═══════════════════════════════════════════════════════════════════════════════
function backfillPenjualanINV() {
  try {
    const penjualanAll = getAll('Penjualan_App');
    if (!penjualanAll.success) return penjualanAll;

    const invoices = new Set();
    penjualanAll.data.forEach(r => { 
      const inv = (r.no_invoice || '').toString().trim(); 
      if (inv) invoices.add(inv); 
    });

    let synced = 0, failed = 0, skipped = 0;

    invoices.forEach(inv => {
      const result = syncPenjualanINV(inv);
      if (result.success) {
        if (result.updated_existing) {
          skipped++; // Existing invoice dipertahankan
        } else {
          synced++;
        }
      } else {
        failed++;
      }
    });

    return { 
      success: true, 
      total_invoice: invoices.size, 
      synced_baru: synced, 
      skipped_pertahankan: skipped,
      failed: failed,
      note: 'REVISI OPSI A: Existing invoice payment fields dipertahankan. Invoice baru default Hutang/0.'
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A: submitPenjualan()
// 
// Perubahan: Ketika status_bayar = "Lunas" (Lunas Transfer/Lunas Cash/Lunas QRIS),
// otomatis create Kas_Masuk entry dengan nilai dari total_bayar.
// Mapping type_pembayaran → cash_account otomatis.
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A: submitPenjualan()
// 
// Perubahan:
// 1. total_diskon = (jumlah * harga_satuan) - diskon (bukan detail.total - diskon)
// 2. Ketika status_bayar = "Lunas", otomatis create Kas_Masuk
// 3. total_bayar diisi ke Penjualan_App juga (agar syncPenjualanINV bisa baca)
// ═══════════════════════════════════════════════════════════════════════════════
function submitPenjualan(data) {
  try {
    let details = data.details;
    if (typeof details === 'string') {
      try { details = JSON.parse(details); } catch(e) { details = []; }
    }
    if (!details || !Array.isArray(details) || details.length === 0) {
      return { success: false, message: 'Tidak ada barang di detail penjualan' };
    }

    const stockWarnings = [];
    details.forEach(detail => {
      const idProduk = detail.id_produk || detail.nama_barang;
      if (!idProduk) return;
      const jumlah = parseFloat(detail.jumlah) || 0;
      if (jumlah <= 0) return;
      const stockResult = getStock(idProduk);
      const saldo = stockResult.success && stockResult.data ? (parseFloat(stockResult.data.saldo) || 0) : 0;
      if (saldo < jumlah) {
        stockWarnings.push(`${detail.nama_barang}: stok ${saldo}, diminta ${jumlah}`);
      }
    });

    const isSample = (data.kode_transaksi || '').toString().trim().toLowerCase() === 'sample';
    const createdIds = [];

    // ═══════════════════════════════════════════════════════════════════════════
    // REVISI: Hitung total_bayar dan status untuk Penjualan_App
    // ═══════════════════════════════════════════════════════════════════════════
    const statusBayarLower = (data.status_bayar || '').toString().trim().toLowerCase();
    const isLunas = statusBayarLower.startsWith('lunas');
    const totalBayar = isLunas ? (parseFloat(data.total_tagihan) || 0) : (parseFloat(data.total_bayar) || 0);

    details.forEach(detail => {
      const jumlah = parseFloat(detail.jumlah) || 0;
      const hargaSatuan = parseFloat(detail.harga_satuan) || 0;
      const diskon = parseFloat(detail.diskon) || 0;
      const total = parseFloat(detail.total) || 0;

      // FIX 1: total_diskon = (jumlah * harga_satuan) - diskon
      // Bukan detail.total - detail.diskon (karena detail.total mungkin sudah post-discount)
      const totalSebelumDiskon = jumlah * hargaSatuan;
      const totalDiskon = totalSebelumDiskon - diskon;

      const row = {
        id_penjualan: generateId('PEN'),
        tanggal: data.tanggal,
        jatuh_tempo: data.jatuh_tempo || '',
        cost_center: data.cost_center || 'Q.Co',
        salesman: data.salesman,
        no_invoice: data.no_invoice,
        kode_transaksi: data.kode_transaksi || 'Penjualan',
        customer: data.customer,
        nama_barang: detail.nama_barang,
        jumlah: jumlah,
        harga_satuan: hargaSatuan,
        total: total,
        diskon: diskon,
        // FIX 1: total_diskon dihitung dari (jumlah * harga_satuan) - diskon
        total_diskon: totalDiskon,
        ppn: parseFloat(detail.ppn) || 0,
        pph: parseFloat(detail.pph) || 0,
        kemasan: detail.kemasan || '',
        jumlah_kemasan: parseFloat(detail.jumlah_kemasan) || 0,
        batch_no: detail.batch_no || '',
        total_tagihan: parseFloat(data.total_tagihan) || 0,
        type_pembayaran: data.type_pembayaran || 'Hutang',
        status: data.status || 'Pending',
        // FIX 2: total_bayar diisi ke Penjualan_App juga (agar syncPenjualanINV bisa baca)
        total_bayar: totalBayar,
        tanggal_pembayaran: data.tanggal_pembayaran || (isLunas ? data.tanggal : ''),
        status_bayar: data.status_bayar || 'Hutang'
      };
      create('Penjualan_App', row);
      createdIds.push(row.id_penjualan);

      submitMovement({
        tanggal: data.tanggal,
        id_produk: detail.id_produk || detail.nama_barang,
        nama_produk: detail.nama_barang,
        tipe: 'Keluar',
        qty_in: 0,
        qty_out: jumlah,
        referensi: data.no_invoice,
        keterangan: 'Penjualan ke ' + data.customer
      });

      if (isSample) {
        create('Pembelian_App', {
          id_pembelian: generateId('PEM'),
          tanggal: data.tanggal,
          cost_center: data.cost_center || 'Q.Co',
          salesman: data.salesman || '',
          no_dokumen: data.no_invoice,
          kode_transaksi: 'Sample',
          coa: 'Biaya Sales & Marketing',
          nama_supplier: 'Qco',
          nama_barang: detail.nama_barang,
          id_produk: detail.id_produk || '',
          jumlah: jumlah,
          harga_satuan: hargaSatuan,
          total: total,
          kode_lot: '',
          notes: 'Biaya sample dari Penjualan ' + data.no_invoice,
          status_bayar: 'Lunas',
          tanggal_pembayaran: data.tanggal
        });
      }
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // Auto-create Kas_Masuk ketika status_bayar = Lunas
    // ═══════════════════════════════════════════════════════════════════════════
    if (isLunas && totalBayar > 0 && !isSample) {
      const typePembayaran = (data.type_pembayaran || '').toString().trim();
      let cashAccount;

      if (typePembayaran.toLowerCase().includes('cash') || typePembayaran.toLowerCase().includes('tunai') || typePembayaran.toLowerCase().includes('hand')) {
        cashAccount = 'Cash on Hand-IDR';
      } else if (typePembayaran.toLowerCase().includes('transfer') || typePembayaran.toLowerCase().includes('bank') || typePembayaran.toLowerCase().includes('bca')) {
        cashAccount = 'Cash in Bank BCA - IDR';
      } else if (typePembayaran.toLowerCase().includes('qris')) {
        cashAccount = 'Cash on Hand-IDR';
      } else {
        cashAccount = resolveCashAccount(typePembayaran) === COA_KAS ? 'Cash on Hand-IDR' : 'Cash in Bank BCA - IDR';
      }

      const kasData = {
        id_kas: generateId('KAS'),
        tanggal: data.tanggal,
        sales: data.salesman || '',
        no_dokumen: data.no_invoice,
        cash_account: cashAccount,
        kode_transaksi: 'Piutang Usaha',
        lawan_transaksi: data.customer || '',
        no_invoice_ref: data.no_invoice,
        status: 'Lunas',
        kas_masuk: totalBayar,
        keterangan: 'Otomatis dari Penjualan (status: ' + data.status_bayar + ')'
      };
      create('Kas_Masuk', kasData);
    }

    if (!isSample) syncPenjualanINV(data.no_invoice);

    return { success: true, id_penjualan: createdIds[0], count: createdIds.length, stock_warnings: stockWarnings };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}



// ============================================================
// KAS MASUK
// ============================================================
// Looks up an invoice's payment status: total owed, how much has already
// been paid via prior Kas_Masuk entries referencing it, and what's left.
// Used both to prefill the Kas Masuk form and to decide Lunas/Piutang.
// Lists invoices still needing payment - type_pembayaran="Hutang" (the
// original field) or status="Piutang" (the renamed status value going
// forward) - for the Kas Masuk invoice picker, so only relevant invoices
// are offered instead of the full list including already-paid ones.
function getUnpaidInvoices() {
  try {
    const invAll = getAll('Penjualan_INV');
    if (!invAll.success) return invAll;
    
    const rows = invAll.data
      .filter(r => (r.kode_transaksi || '').toString().trim().toLowerCase() !== 'sample')
      .filter(r => (r.status_bayar || '').toString().trim().toLowerCase() === 'piutang')
      .map(r => {
        const noInvoice = (r.no_invoice || '').toString().trim();
        const totalTagihan = parseFloat(r.total_tagihan) || parseFloat(r.total) || 0;
        const totalBayar = parseFloat(r.total_bayar) || 0;
        const sisa = Math.max(0, totalTagihan - totalBayar);
        return { 
          no_invoice: noInvoice, 
          customer: r.customer || '', 
          total_tagihan: totalTagihan,
          sisa: sisa  // ← dari total_tagihan - total_bayar
        };
      })
      .filter(r => r.no_invoice && r.no_invoice.length > 0);
    
    return { success: true, data: rows.sort((a, b) => a.no_invoice.localeCompare(b.no_invoice)) };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}
// Shared 4-state reconciliation: compares total paid (sum of all Kas
// Masuk entries referencing an invoice) against that invoice's
// total_tagihan. "Lunas" and "Piutang" stay compatible with every
// existing status_bayar==='lunas' check elsewhere in the app (DownPayment
// and Kelebihan Bayar both correctly fall through as "not lunas" = still
// outstanding, matching how a partial or over- payment is genuinely not
// yet settled).
function computeInvoicePaymentStatus_(totalTagihan, totalDibayar) {
  if (totalDibayar <= 0) return 'Piutang';
  if (Math.abs(totalDibayar - totalTagihan) < 0.5) return 'Lunas';
  if (totalDibayar < totalTagihan) return 'DownPayment';
  return 'Kelebihan Bayar';
}

// Writes status_bayar to every Penjualan_App row for one invoice, then
// re-syncs Penjualan_INV's aggregate row to match. total_bayar is ONLY
// written when newTotalBayar is explicitly passed (not undefined) - when
// omitted, that field is left completely untouched. This matters because
// when Penjualan_App's own total_bayar is already the source of truth for
// an invoice, it must never be overwritten - not even with the same
// value - so callers in that situation simply don't pass a third argument
// at all, rather than relying on "write back the same number" being safe.
// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A #3: applyInvoicePaymentStatus_()
// 
// Sebelum: Update ke Penjualan_App saja (tidak konsisten dengan Penjualan_INV)
// Sesudah: Update ke Penjualan_INV (primary) + Penjualan_App (UI consistency)
//          Signature: 4 params (noInvoice, statusBayar, newTotalBayar, newTypePembayaran)
// ═══════════════════════════════════════════════════════════════════════════════
function applyInvoicePaymentStatus_(noInvoice, statusBayar, newTotalBayar, newTypePembayaran) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // UPDATE PRIMARY: Penjualan_INV
  const invSheet = ss.getSheetByName('Penjualan_INV');
  if (invSheet && invSheet.getLastRow() > 1) {
    const invData = invSheet.getRange(2, 1, invSheet.getLastRow() - 1, invSheet.getLastColumn()).getValues();
    const invHeaders = invSheet.getRange(1, 1, 1, invSheet.getLastColumn()).getValues()[0];
    const invIdx = invHeaders.indexOf('no_invoice');
    const statusBayarIdx = invHeaders.indexOf('status_bayar');
    const totalBayarIdx = invHeaders.indexOf('total_bayar');
    const tipeIdx = invHeaders.indexOf('type_pembayaran');

    if (invIdx !== -1) {
      invData.forEach((row, i) => {
        if ((row[invIdx] || '').toString().trim() === noInvoice) {
          if (statusBayarIdx !== -1) {
            invSheet.getRange(i + 2, statusBayarIdx + 1).setValue(statusBayar);
          }
          if (newTotalBayar !== undefined && totalBayarIdx !== -1) {
            invSheet.getRange(i + 2, totalBayarIdx + 1).setValue(newTotalBayar);
          }
          if (newTypePembayaran && tipeIdx !== -1) {
            invSheet.getRange(i + 2, tipeIdx + 1).setValue(newTypePembayaran);
          }
        }
      });
    }
  }

  // UPDATE SECONDARY: Penjualan_App (untuk UI consistency)
  const penjualanSheet = ss.getSheetByName('Penjualan_App');
  if (penjualanSheet && penjualanSheet.getLastRow() > 1) {
    const pData = penjualanSheet.getRange(2, 1, penjualanSheet.getLastRow() - 1, penjualanSheet.getLastColumn()).getValues();
    const pHeaders = penjualanSheet.getRange(1, 1, 1, penjualanSheet.getLastColumn()).getValues()[0];
    const invIdx = pHeaders.indexOf('no_invoice');
    const statusBayarIdx = pHeaders.indexOf('status_bayar');
    const totalBayarIdx = pHeaders.indexOf('total_bayar');
    const tipeIdx = pHeaders.indexOf('type_pembayaran');

    if (invIdx !== -1 && statusBayarIdx !== -1) {
      pData.forEach((row, i) => {
        if ((row[invIdx] || '').toString().trim() === noInvoice) {
          penjualanSheet.getRange(i + 2, statusBayarIdx + 1).setValue(statusBayar);
          if (newTotalBayar !== undefined && totalBayarIdx !== -1) {
            penjualanSheet.getRange(i + 2, totalBayarIdx + 1).setValue(newTotalBayar);
          }
          if (newTypePembayaran && tipeIdx !== -1) {
            penjualanSheet.getRange(i + 2, tipeIdx + 1).setValue(newTypePembayaran);
          }
        }
      });
    }
  }
}


// ============================================================================
// REVISI: reconcileAllInvoiceStatus + applyInvoicePaymentStatus_ + submitKasMasuk
// ============================================================================
// Perubahan:
// 1. Baca data dari Penjualan_INV (kolom total_bayar, status_bayar, type_pembayaran)
// 2. Update di Penjualan_INV kolom type_pembayaran (existing)
//    - Cash on Hand-IDR → Lunas Cash
//    - Cash in Bank BCA - IDR → Lunas Transfer
// ============================================================================

// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A #4: reconcileAllInvoiceStatus()
// 
// Sebelum: Baca dari Penjualan_App + Kas_Masuk, update ke Penjualan_App
// Sesudah: Baca dari Penjualan_INV + Kas_Masuk, update ke Penjualan_INV
//          TIDAK sentuh Penjualan_App langsung (kecuali via applyInvoicePaymentStatus_)
// ═══════════════════════════════════════════════════════════════════════════════
function reconcileAllInvoiceStatus() {
  try {
    const invAll = getAll('Penjualan_INV');
    const kasMasukAll = getAll('Kas_Masuk');
    if (!invAll.success) return invAll;

    const validInvoiceNumbers = new Set(
      invAll.data.map(r => (r.no_invoice || '').toString().trim()).filter(v => v)
    );

    const paidByInvoice = {};
    if (kasMasukAll.success) {
      kasMasukAll.data.forEach(r => {
        const refField = (r.no_invoice_ref || '').toString().trim();
        const noDokumen = (r.no_dokumen || '').toString().trim();
        const ref = refField || (validInvoiceNumbers.has(noDokumen) ? noDokumen : '');
        if (!ref) return;
        paidByInvoice[ref] = (paidByInvoice[ref] || 0) + (parseFloat(r.kas_masuk) || 0);
      });
    }

    const results = { Lunas: 0, Piutang: 0, DownPayment: 0, 'Kelebihan Bayar': 0 };
    const changed = [];

    invAll.data.forEach(r => {
      const inv = (r.no_invoice || '').toString().trim();
      if (!inv || (r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample') return;

      const totalTagihan = parseFloat(r.total_tagihan) || parseFloat(r.total) || 0;
      const totalBayarPenjualan = parseFloat(r.total_bayar) || 0;

      let newStatus, sumber, newTypePembayaran;

      // REVISI OPSI A: Prioritaskan total_bayar dari Penjualan_INV (bukan dari App)
      if (totalBayarPenjualan > 0) {
        newStatus = computeInvoicePaymentStatus_(totalTagihan, totalBayarPenjualan);
        sumber = 'Penjualan_INV.total_bayar';
        newTypePembayaran = mapCashAccountToTypePembayaran(r.type_pembayaran);
      } else {
        // Fallback ke Kas_Masuk
        const totalDibayarKasMasuk = paidByInvoice[inv] || 0;
        newStatus = computeInvoicePaymentStatus_(totalTagihan, totalDibayarKasMasuk);
        sumber = 'Kas_Masuk';
        newTypePembayaran = getTypePembayaranFromKasMasuk(kasMasukAll.data, inv);
      }

      results[newStatus] = (results[newStatus] || 0) + 1;

      const oldStatus = (r.status_bayar || '').toString().trim();
      const oldTypePembayaran = (r.type_pembayaran || '').toString().trim();

      if (oldStatus.toLowerCase() !== newStatus.toLowerCase() || oldTypePembayaran !== newTypePembayaran) {
        // REVISI OPSI A: Update ke Penjualan_INV (primary) via applyInvoicePaymentStatus_
        applyInvoicePaymentStatus_(inv, newStatus, paidByInvoice[inv] || 0, newTypePembayaran);
        changed.push({
          no_invoice: inv,
          status_lama: oldStatus,
          status_baru: newStatus,
          type_pembayaran_lama: oldTypePembayaran,
          type_pembayaran_baru: newTypePembayaran,
          total_tagihan: totalTagihan,
          sumber: sumber
        });
      }
    });

    return {
      success: true,
      message: 'Reconcile completed (REVISI OPSI A)',
      ringkasan_status: results,
      jumlah_berubah: changed.length,
      detail_perubahan: changed,
      note: 'Sumber: Penjualan_INV + Kas_Masuk. Penjualan_App tidak disentuh langsung.'
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}


// ============================================================================
// REVISI: applyInvoicePaymentStatus_
// ============================================================================
// Update kolom type_pembayaran di Penjualan_INV langsung
// ============================================================================

function applyInvoicePaymentStatus_(noInvoice, statusBayar, newTotalBayar, newTypePembayaran) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const penjualanSheet = ss.getSheetByName('Penjualan_INV');
  if (!penjualanSheet || penjualanSheet.getLastRow() <= 1) return;

  const pData = penjualanSheet.getRange(2, 1, penjualanSheet.getLastRow() - 1, penjualanSheet.getLastColumn()).getValues();
  const pHeaders = penjualanSheet.getRange(1, 1, 1, penjualanSheet.getLastColumn()).getValues()[0];
  
  const invIdx = pHeaders.indexOf('no_invoice');
  const statusBayarIdx = pHeaders.indexOf('status_bayar');
  const totalBayarIdx = pHeaders.indexOf('total_bayar');
  const typePembayaranIdx = pHeaders.indexOf('type_pembayaran');

  if (invIdx === -1) return;

  pData.forEach((row, i) => {
    if ((row[invIdx] || '').toString().trim() === noInvoice) {
      if (statusBayarIdx !== -1) {
        penjualanSheet.getRange(i + 2, statusBayarIdx + 1).setValue(statusBayar);
      }
      if (newTotalBayar !== undefined && totalBayarIdx !== -1) {
        penjualanSheet.getRange(i + 2, totalBayarIdx + 1).setValue(newTotalBayar);
      }
      if (newTypePembayaran && typePembayaranIdx !== -1) {
        penjualanSheet.getRange(i + 2, typePembayaranIdx + 1).setValue(newTypePembayaran);
      }
    }
  });
}

// ============================================================================
// REVISI: submitKasMasuk
// ============================================================================
// Update type_pembayaran di Penjualan_INV
// Cash account mapping: Cash on Hand-IDR → Lunas Cash, Cash in Bank BCA - IDR → Lunas Transfer
// ============================================================================

// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A #5: submitKasMasuk()
// 
// Sebelum: Tidak update type_pembayaran di Penjualan_INV
// Sesudah: Update type_pembayaran di Penjualan_INV via applyInvoicePaymentStatus_
//          Mapping cash_account → type_pembayaran otomatis
// ═══════════════════════════════════════════════════════════════════════════════
function submitKasMasuk(data) {
  try {
    const isPiutang = (data.kode_transaksi || '').toString().toLowerCase().includes('piutang');
    let lawanTransaksi = data.lawan_transaksi || '';
    let status = '';
    const kasMasukAmount = parseFloat(data.kas_masuk) || 0;

    if (isPiutang && data.no_invoice_ref) {
      const invoiceInfo = getInvoiceForPayment(data.no_invoice_ref);
      if (invoiceInfo.success) {
        const info = invoiceInfo.data;
        lawanTransaksi = `${info.no_invoice} - ${info.customer} - Rp${kasMasukAmount.toLocaleString('id-ID')}`;
        const totalTerbayarSetelahIni = info.sudah_dibayar + kasMasukAmount;
        status = computeInvoicePaymentStatus_(info.total_tagihan, totalTerbayarSetelahIni);

        // REVISI OPSI A: Mapping cash_account → type_pembayaran
        const mappedTypePembayaran = mapCashAccountToTypePembayaran(data.cash_account);
        applyInvoicePaymentStatus_(info.no_invoice, status, totalTerbayarSetelahIni, mappedTypePembayaran);
      } else {
        lawanTransaksi = data.lawan_transaksi || data.no_invoice_ref;
        status = 'Piutang';
      }
    } else if (!isPiutang) {
      lawanTransaksi = data.lawan_transaksi || data.sumber_dana || '';
      status = '';
    }

    const keteranganWithTermin = (data.termin ? `[Termin: ${data.termin}] ` : '') + (data.keterangan || '');
    const kasData = {
      id_kas: generateId('KAS'),
      tanggal: data.tanggal,
      sales: data.sales,
      no_dokumen: data.no_dokumen,
      cash_account: data.cash_account,
      kode_transaksi: data.kode_transaksi || 'Kas Masuk',
      lawan_transaksi: lawanTransaksi,
      no_invoice_ref: isPiutang ? (data.no_invoice_ref || '') : '',
      status: '',
      kas_masuk: kasMasukAmount,
      keterangan: keteranganWithTermin
    };
    create('Kas_Masuk', kasData);
    return { success: true, id_kas: kasData.id_kas, status: status, lawan_transaksi: lawanTransaksi };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}


// ============================================================================
// HELPER: Mapping cash_account → type_pembayaran
// ============================================================================

// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A #6 (FUNGSI BARU): mapCashAccountToTypePembayaran()
// 
// Mapping otomatis cash_account → type_pembayaran
// Cash on Hand-IDR → Lunas Cash
// Cash in Bank BCA - IDR → Lunas Transfer
// ═══════════════════════════════════════════════════════════════════════════════
function mapCashAccountToTypePembayaran(cashAccount) {
  const account = (cashAccount || '').toString().trim();

  if (account === 'Cash on Hand-IDR' || account.toLowerCase().includes('hand') || account.toLowerCase().includes('tunai') || account.toLowerCase().includes('cash')) {
    return 'Lunas Cash';
  }
  if (account === 'Cash in Bank BCA - IDR' || account.toLowerCase().includes('bank') || account.toLowerCase().includes('transfer') || account.toLowerCase().includes('bca')) {
    return 'Lunas Transfer';
  }

  if (account.toLowerCase().startsWith('lunas')) {
    return account;
  }

  return account; // return as-is kalau tidak match
}


// ============================================================================
// HELPER: Ambil type_pembayaran dari Kas_Masuk berdasarkan invoice
// ============================================================================

// ═══════════════════════════════════════════════════════════════════════════════
// REVISI OPSI A #7 (FUNGSI BARU): getTypePembayaranFromKasMasuk()
// 
// Ambil type_pembayaran dari Kas_Masuk berdasarkan invoice
// ═══════════════════════════════════════════════════════════════════════════════
function getTypePembayaranFromKasMasuk(kasMasukData, noInvoice) {
  if (!kasMasukData || !Array.isArray(kasMasukData)) return '';

  const invStr = (noInvoice || '').toString().trim();
  if (!invStr) return '';

  const matchingRows = kasMasukData.filter(r => {
    const ref = (r.no_invoice_ref || '').toString().trim();
    const dok = (r.no_dokumen || '').toString().trim();
    return ref === invStr || dok === invStr;
  });

  if (matchingRows.length === 0) return '';

  const cashAccount = (matchingRows[0].cash_account || '').toString().trim();
  return mapCashAccountToTypePembayaran(cashAccount);
}


// ============================================================
// STOCK MOVEMENT
// ============================================================
function submitMovement(data) {
  try {
    const stockData = getStock(data.id_produk);
    const currentSaldo = stockData.success ? stockData.data.saldo || 0 : 0;
    const newSaldo = currentSaldo + (parseFloat(data.qty_in) || 0) - (parseFloat(data.qty_out) || 0);

    const movementData = {
      id_movement: generateId('MOV'),
      tanggal: data.tanggal,
      id_produk: data.id_produk,
      nama_produk: data.nama_produk,
      tipe: data.tipe,
      qty_in: parseFloat(data.qty_in) || 0,
      qty_out: parseFloat(data.qty_out) || 0,
      saldo: newSaldo,
      referensi: data.referensi || '',
      keterangan: data.keterangan || ''
    };
    create('Stock_Movement', movementData);
    return { success: true, id_movement: movementData.id_movement, saldo: newSaldo };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ============================================================
// HPP CALCULATION
// ============================================================
function calculateHPP(data) {
  try {
    const resepData = getResep(data.id_produk);
    let totalBahan = 0;

    if (resepData.success && resepData.data && resepData.data.length > 0) {
      resepData.data.forEach(r => {
        const hargaBahan = parseFloat(r.harga_bahan) || 0;
        const komposisi = parseFloat(r.komposisi) || 0;
        const qtyBahan = (parseFloat(data.qty_produksi) || 1) * komposisi;
        totalBahan += qtyBahan * hargaBahan;
      });
    }

    let details = data.details;
    if (typeof details === 'string') {
      try { details = JSON.parse(details); } catch(e) { details = []; }
    }
    if (details && Array.isArray(details)) {
      totalBahan = details.reduce((sum, d) => sum + ((parseFloat(d.jumlah_raw_material) || 0) * (parseFloat(d.harga_raw_material) || 0)), 0);
    }

    // Overhead is no longer applied - not a real recorded cost. HPP is
    // material cost only. Fields kept at 0 for schema/report compatibility.
    const overheadPercent = 0;
    const overheadAmount = 0;
    const totalBiaya = totalBahan;

    const qtyProduksi = parseFloat(data.qty_produksi) || 1;
    const hppPerUnit = qtyProduksi > 0 ? totalBiaya / qtyProduksi : 0;

    const hppData = {
      id_hpp: generateId('HPP'),
      tanggal: data.tanggal || new Date().toISOString(),
      id_produk: data.id_produk,
      nama_produk: data.nama_produk || data.id_produk,
      tipe: data.tipe || 'Assembly',
      qty_produksi: qtyProduksi,
      total_bahan: totalBahan,
      overhead_percent: overheadPercent,
      overhead_amount: overheadAmount,
      total_biaya: totalBiaya,
      hpp_per_unit: hppPerUnit,
      referensi: data.batch_no || data.referensi || ''
    };
    create('HPP_Calculation', hppData);

    return { success: true, hpp: hppPerUnit, total_biaya: totalBiaya, overhead_amount: overheadAmount, id_hpp: hppData.id_hpp };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function getHPP(id_produk) {
  const idStr = (id_produk === undefined || id_produk === null) ? '' : id_produk.toString().trim();
  const all = getAll('HPP_Calculation');
  if (all.success) {
    const records = all.data.filter(r => (r.id_produk !== undefined && r.id_produk !== null && r.id_produk.toString().trim() === idStr)).sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );
    if (records[0]) return { success: true, data: records[0] };
  }
  // Fall back to the most recent Assembly_Entry batch's own hpp field for
  // this SKU - HPP_Calculation only gets written by a live submitAssembly()
  // (via calculateHPP()), so any product whose only production history is
  // the historical import never has an HPP_Calculation row at all.
  const assemblyAll = getAll('Assembly_Entry');
  if (assemblyAll.success) {
    const batches = assemblyAll.data.filter(r => (r.sku || '').toString().trim() === idStr && parseFloat(r.hpp) > 0)
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    if (batches[0]) {
      return { success: true, data: { id_produk: idStr, hpp_per_unit: batches[0].hpp, sumber: 'Assembly_Entry', batch_no: batches[0].batch_no, tanggal: batches[0].tanggal } };
    }
  }
  return { success: true, data: null };
}

// Diagnostic helper: call ?action=debugHargaBahan&nama_bahan=XXX&callback=x
// (nama_bahan = the exact "bahan" text from Master_Resep, e.g. a raw
// material name) to see exactly where the average-price chain breaks:
// whether Pembelian has any data at all, whether Master_Produk resolves
// the name, and what (if anything) matched.
// Diagnostic: shows exactly what's in the first 3 rows of a sheet, raw, no
// interpretation. Use this to directly verify whether row 1 is really a
// proper header row or if it's been overwritten/lost.
// Call: ?action=debugSheetHeader&sheet_name=Pembelian&callback=x
// Lists every sheet/tab in the spreadsheet with row/col counts. Use this to
// see the whole picture at once - e.g. to confirm the raw "Pembelian" sheet
// and the app's "Pembelian_App" sheet now coexist as separate tabs.
function listAllSheets() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = ss.getSheets().map(s => ({
      name: s.getName(),
      rows: s.getLastRow(),
      cols: s.getLastColumn()
    }));
    return { success: true, sheets: sheets };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugSheetHeader(sheetName) {
  try {
    const target = sheetName || 'Pembelian_App';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(target);
    if (!sheet) return { success: false, message: 'Sheet not found: ' + target };
    const lastCol = sheet.getLastColumn();
    const lastRow = sheet.getLastRow();
    const rowAt = (r) => (lastRow >= r && lastCol > 0) ? sheet.getRange(r, 1, 1, lastCol).getValues()[0] : [];
    return {
      success: true,
      sheet: target,
      last_row: lastRow,
      last_col: lastCol,
      row_1: rowAt(1),
      row_2: rowAt(2),
      row_3: rowAt(3)
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Force-rewrites a sheet's header row (row 1) to match SHEET_CONFIG,
// regardless of whatever is currently there. Use this if debugSheetHeader
// shows row 1 is missing/wrong/actually data. Does not touch any other row.
// Call: ?action=repairHeader&table=Pembelian&callback=x
// Known correct header row for each RAW source sheet, used to detect and
// repair a lost/shifted header (e.g. if row 1 now holds data instead of
// column names, everything below silently fails to be recognized).
const RAW_SHEET_HEADERS = {
  'Pembelian': ['No', 'Tanggal', 'Cost Center', 'Salesman', 'No Dokumen', 'Kode Transaksi', 'COA Expenses', 'Nama Supplier', 'Nama Barang', 'Notes', 'Jumlah', 'Harga Satuan', 'Total', 'Status Bayar', 'Tanggal Pembayaran', 'Time Stamps', 'Kode LOT (No Vendor, COA dan No FP)'],
  'AssemblyEntry': ['DATE', 'BATCH NO', 'SKU', 'Nama Barang', 'Jumlah Produksi', 'Raw Material', 'Jumlah Raw Material', 'HPP']
};

// Repairs a raw source sheet's header by INSERTING a new row 1 with the
// correct column names (shifting all existing data down by one row) -
// unlike repairHeader() this never overwrites/destroys data, since if row 1
// currently holds a real data row, that row just moves to row 2 instead of
// being lost. If row 1 already matches the expected header, does nothing.
// Call: ?action=repairRawHeader&sheet_name=Pembelian&callback=x
function repairRawHeader(sheetName) {
  try {
    const expected = RAW_SHEET_HEADERS[sheetName];
    if (!expected) return { success: false, message: 'Tidak ada definisi header baku untuk sheet: ' + sheetName };
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { success: false, message: 'Sheet not found: ' + sheetName };

    const lastCol = sheet.getLastColumn();
    const row1 = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    if (row1[0] && row1[0].toString().trim() === expected[0]) {
      return { success: true, message: 'Header sudah benar, tidak ada yang diubah', already_ok: true, row_1: row1 };
    }

    sheet.insertRowBefore(1);
    const headerRange = sheet.getRange(1, 1, 1, expected.length);
    headerRange.setValues([expected]);
    headerRange.setFontWeight('bold');
    return { success: true, message: 'Baris header disisipkan di baris 1. Data lama digeser turun satu baris, tidak ada yang hilang.', inserted: true, header: expected };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function repairHeader(table) {
  try {
    if (!table || !SHEET_CONFIG[table]) {
      return { success: false, message: 'Table tidak dikenal: ' + table };
    }
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(table);
    if (!sheet) return { success: false, message: 'Sheet not found: ' + table };
    const headers = SHEET_CONFIG[table].headers;
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    return { success: true, message: 'Header ' + table + ' ditulis ulang', headers: headers };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Scans Assembly_Entry for every distinct raw material currently priced at
// 0, and explains WHY for each: either there's genuinely no purchase
// history anywhere for that name (needs a manual price via setHargaBeli),
// or Pembelian_App has SOMETHING with a similar name that isn't an exact
// match (needs the name reconciled - shows the closest candidates found).
// Call: ?action=debugZeroPriceMaterials&callback=x
function debugZeroPriceMaterials() {
  try {
    const assemblyAll = getAll('Assembly_Entry');
    if (!assemblyAll.success) return assemblyAll;
    const pembelianAll = getAll('Pembelian_App');
    const produkAll = getAll('Master_Produk');

    const pembelianNames = pembelianAll.success
      ? [...new Set(pembelianAll.data.map(d => (d.nama_barang || '').toString().trim()).filter(n => n))]
      : [];

    const zeroMaterials = {};
    assemblyAll.data.forEach(r => {
      const harga = parseFloat(r.harga_raw_material) || 0;
      if (harga > 0) return;
      const nama = (r.raw_material || '').toString().trim();
      if (!nama) return;
      if (!zeroMaterials[nama]) zeroMaterials[nama] = { nama_bahan: nama, jumlah_baris_terpengaruh: 0, contoh_batch: [] };
      zeroMaterials[nama].jumlah_baris_terpengaruh++;
      if (zeroMaterials[nama].contoh_batch.length < 3) zeroMaterials[nama].contoh_batch.push(r.batch_no);
    });

    const result = Object.values(zeroMaterials).map(item => {
      const namaLower = item.nama_bahan.toLowerCase();
      const exactPembelianMatch = pembelianNames.some(n => n.toLowerCase() === namaLower);
      // Loosely similar Pembelian names (share a word) - just a hint, not
      // an auto-fix, so a human confirms before anything gets renamed.
      const nameWords = namaLower.split(/\s+/).filter(w => w.length > 3);
      const candidates = pembelianNames.filter(n => {
        const nLower = n.toLowerCase();
        return nameWords.some(w => nLower.includes(w));
      }).slice(0, 5);
      const foundInMasterProduk = produkAll.success
        ? produkAll.data.some(p => (p.nama_produk || '').toString().trim().toLowerCase() === namaLower)
        : false;

      return {
        nama_bahan: item.nama_bahan,
        jumlah_baris_terpengaruh: item.jumlah_baris_terpengaruh,
        contoh_batch: item.contoh_batch,
        ada_di_master_produk: foundInMasterProduk,
        ada_persis_di_pembelian: exactPembelianMatch,
        kandidat_nama_mirip_di_pembelian: exactPembelianMatch ? [] : candidates,
        kesimpulan: exactPembelianMatch
          ? 'Ada exact match di Pembelian tapi masih 0 - cek debugHargaBahan untuk detail'
          : (candidates.length > 0
            ? 'Tidak ada exact match, tapi ada nama mirip di Pembelian (lihat kandidat) - kemungkinan beda penulisan'
            : 'Tidak ada riwayat pembelian sama sekali untuk nama ini - perlu harga manual (pakai setHargaBeli)')
      };
    }).sort((a, b) => b.jumlah_baris_terpengaruh - a.jumlah_baris_terpengaruh);

    return { success: true, total_bahan_harga_nol: result.length, detail: result };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Directly sets/overrides harga_beli for a product in Master_Produk -
// for old-stock items with genuinely no purchase history on record, where
// a manual reference price is the only option. Matches by id_produk first,
// falling back to an exact nama_produk match.
// Call: ?action=setHargaBeli&nama_atau_id=Angling&harga=150000&callback=x
function setHargaBeli(namaAtauId, harga) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Master_Produk');
    if (!sheet) return { success: false, message: 'Sheet Master_Produk not found' };
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIdx = headers.indexOf('id_produk');
    const namaIdx = headers.indexOf('nama_produk');
    const hargaBeliIdx = headers.indexOf('harga_beli');
    const updatedIdx = headers.indexOf('updated_at');
    if (idIdx === -1 || namaIdx === -1 || hargaBeliIdx === -1) {
      return { success: false, message: 'Kolom id_produk/nama_produk/harga_beli tidak ditemukan' };
    }
    const target = (namaAtauId || '').toString().trim().toLowerCase();
    const hargaNum = parseFloat(harga) || 0;
    const timestamp = new Date().toISOString();
    let updated = 0;
    const matchedNames = [];
    for (let i = 1; i < data.length; i++) {
      const id = (data[i][idIdx] || '').toString().trim().toLowerCase();
      const nama = (data[i][namaIdx] || '').toString().trim().toLowerCase();
      if (id === target || nama === target || nama.includes(target)) {
        sheet.getRange(i + 1, hargaBeliIdx + 1).setValue(hargaNum);
        if (updatedIdx !== -1) sheet.getRange(i + 1, updatedIdx + 1).setValue(timestamp);
        matchedNames.push(data[i][namaIdx]);
        updated++;
      }
    }
    return { success: updated > 0, message: updated + ' produk diperbarui', updated: updated, matched: matchedNames };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugHargaBahan(nama_bahan) {
  const namaStr = (nama_bahan || '').toString().trim();
  const pembelianAll = getAll('Pembelian_App');
  const produkAll = getAll('Master_Produk');

  const match = produkAll.success
    ? produkAll.data.find(p => (p.nama_produk || '').toString().trim().toLowerCase() === namaStr.toLowerCase())
    : null;
  const bahanId = match ? (match.id_produk || '').toString() : '';

  const avgHarga = getHargaRataRataPembelian(bahanId, namaStr);
  const hppResult = bahanId ? getHPP(bahanId) : { success: false };
  const hppHarga = hppResult.success && hppResult.data ? (parseFloat(hppResult.data.hpp_per_unit) || 0) : 0;
  const assemblyHarga = bahanId ? getHargaRataRataAssembly(bahanId) : 0;
  const hargaBeliMaster = match ? (parseFloat(match.harga_beli) || 0) : 0;
  const sumberDipakai = avgHarga > 0 ? 'rata_rata_pembelian' : (hppHarga > 0 ? 'hpp_calculation' : (assemblyHarga > 0 ? 'rata_rata_assembly_entry' : 'harga_beli_master_produk'));

  const assemblyAll = getAll('Assembly_Entry');
  const assemblyMatchingRows = assemblyAll.success
    ? assemblyAll.data.filter(r => (r.sku || '').toString().trim() === bahanId)
    : [];
  let sampleDistinctSkus = [];
  if (assemblyMatchingRows.length === 0 && assemblyAll.success) {
    const seen = new Set();
    for (const r of assemblyAll.data) {
      const sku = (r.sku || '').toString().trim();
      if (sku && !seen.has(sku)) { seen.add(sku); sampleDistinctSkus.push(sku); }
      if (sampleDistinctSkus.length >= 20) break;
    }
  }

  return {
    success: true,
    dicari: namaStr,
    total_baris_pembelian: pembelianAll.success ? pembelianAll.data.length : 0,
    contoh_baris_pembelian: pembelianAll.success ? pembelianAll.data.slice(0, 5).map(d => ({
      nama_barang: d.nama_barang, id_produk: d.id_produk, jumlah: d.jumlah, harga_satuan: d.harga_satuan
    })) : [],
    ditemukan_di_master_produk: !!match,
    id_produk_hasil_resolve: bahanId,
    baris_pembelian_yang_cocok: pembelianAll.success ? pembelianAll.data.filter(d => {
      const dId = (d.id_produk || '').toString().trim();
      const dNama = (d.nama_barang || '').toString().trim().toLowerCase();
      return (bahanId && dId === bahanId) || dNama === namaStr.toLowerCase();
    }).length : 0,
    rata_rata_pembelian: avgHarga,
    hpp_calculation: hppHarga,
    rata_rata_assembly_entry: assemblyHarga,
    total_baris_assembly_entry_saat_ini: assemblyAll.success ? assemblyAll.data.length : 0,
    baris_assembly_entry_dengan_sku_ini: assemblyMatchingRows.length,
    contoh_baris_assembly_entry_sku_ini: assemblyMatchingRows.slice(0, 10).map(r => ({
      batch_no: r.batch_no, sku: r.sku, jumlah_produksi: r.jumlah_produksi, raw_material: r.raw_material, jumlah_raw_material: r.jumlah_raw_material, harga_raw_material: r.harga_raw_material
    })),
    contoh_sku_lain_yang_ada_di_assembly_entry: sampleDistinctSkus,
    harga_beli_master_produk: hargaBeliMaster,
    sumber_yang_dipakai: sumberDipakai,
    rata_rata_dihasilkan: avgHarga
  };
}

// Weighted average purchase price (= total value bought / total qty bought)
// for a raw material, matched by id_produk when available (new purchases
// carry it) and falling back to an exact nama_barang match for older
// purchase rows recorded before id_produk was tracked. Returns 0 if there's
// no purchase history to average.
function getHargaRataRataPembelian(id_produk, namaBarang) {
  const all = getAll('Pembelian_App');
  if (!all.success || !all.data.length) return 0;
  const idStr = (id_produk || '').toString().trim();
  const namaStr = (namaBarang || '').toString().trim().toLowerCase();

  const matches = all.data.filter(d => {
    const dId = (d.id_produk || '').toString().trim();
    if (idStr && dId && dId === idStr) return true;
    const dNama = (d.nama_barang || '').toString().trim().toLowerCase();
    return !!namaStr && dNama === namaStr;
  });
  if (matches.length === 0) return 0;

  let totalQty = 0, totalValue = 0;
  matches.forEach(d => {
    const qty = parseFloat(d.jumlah) || 0;
    const harga = parseFloat(d.harga_satuan) || 0;
    totalQty += qty;
    totalValue += qty * harga;
  });
  return totalQty > 0 ? (totalValue / totalQty) : 0;
}

// Batch-updates harga_beli in Master_Produk for every product that has
// purchase history, using the same weighted-average logic as
// getHargaRataRataPembelian but computed once for all products in a single
// pass (instead of one Pembelian scan per product). Products with no
// purchase history at all are left untouched.
// Same idea as syncHargaBeliFromPembelian() but for Master_Kemasan's
// harga field, matched by name against Pembelian_App's nama_barang
// (kemasan purchases are recorded there the same way raw materials are).
function syncHargaKemasanFromPembelian() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const kemasanSheet = ss.getSheetByName('Master_Kemasan');
    if (!kemasanSheet) return { success: false, message: 'Sheet Master_Kemasan not found' };

    const pembelianAll = getAll('Pembelian_App', ss);
    if (!pembelianAll.success) return { success: false, message: 'Gagal membaca Pembelian' };

    const aggByName = {};
    pembelianAll.data.forEach(d => {
      const qty = parseFloat(d.jumlah) || 0;
      const harga = parseFloat(d.harga_satuan) || 0;
      if (qty <= 0) return;
      const nama = (d.nama_barang || '').toString().trim().toLowerCase();
      if (!nama) return;
      if (!aggByName[nama]) aggByName[nama] = { qty: 0, value: 0 };
      aggByName[nama].qty += qty;
      aggByName[nama].value += qty * harga;
    });

    const data = kemasanSheet.getDataRange().getValues();
    const headers = data[0];
    const namaIdx = headers.indexOf('nama_kemasan');
    const hargaIdx = headers.indexOf('harga');
    const updatedIdx = headers.indexOf('updated_at');
    if (namaIdx === -1 || hargaIdx === -1) {
      return { success: false, message: 'Kolom nama_kemasan/harga tidak ditemukan di Master_Kemasan' };
    }

    const timestamp = new Date().toISOString();
    let updated = 0, noMatch = [];
    for (let i = 1; i < data.length; i++) {
      const nama = (data[i][namaIdx] || '').toString().trim().toLowerCase();
      const agg = aggByName[nama];
      if (agg && agg.qty > 0) {
        const avg = agg.value / agg.qty;
        const current = parseFloat(data[i][hargaIdx]) || 0;
        if (Math.round(avg) !== Math.round(current)) {
          kemasanSheet.getRange(i + 1, hargaIdx + 1).setValue(avg);
          if (updatedIdx !== -1) kemasanSheet.getRange(i + 1, updatedIdx + 1).setValue(timestamp);
          updated++;
        }
      } else {
        noMatch.push(data[i][namaIdx]);
      }
    }
    return { success: true, updated: updated, tidak_ada_riwayat_pembelian: noMatch };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function syncHargaBeliFromPembelian() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const produkSheet = ss.getSheetByName('Master_Produk');
    if (!produkSheet) return { success: false, message: 'Sheet Master_Produk not found' };

    const pembelianAll = getAll('Pembelian_App', ss);
    if (!pembelianAll.success) return { success: false, message: 'Gagal membaca Pembelian' };

    const aggById = {}, aggByName = {};
    pembelianAll.data.forEach(d => {
      const qty = parseFloat(d.jumlah) || 0;
      const harga = parseFloat(d.harga_satuan) || 0;
      if (qty <= 0) return;
      const id = (d.id_produk || '').toString().trim();
      const nama = (d.nama_barang || '').toString().trim().toLowerCase();
      if (id) {
        if (!aggById[id]) aggById[id] = { qty: 0, value: 0 };
        aggById[id].qty += qty;
        aggById[id].value += qty * harga;
      }
      if (nama) {
        if (!aggByName[nama]) aggByName[nama] = { qty: 0, value: 0 };
        aggByName[nama].qty += qty;
        aggByName[nama].value += qty * harga;
      }
    });

    const data = produkSheet.getDataRange().getValues();
    const headers = data[0];
    const idIdx = headers.indexOf('id_produk');
    const namaIdx = headers.indexOf('nama_produk');
    const hargaBeliIdx = headers.indexOf('harga_beli');
    const updatedIdx = headers.indexOf('updated_at');
    if (idIdx === -1 || namaIdx === -1 || hargaBeliIdx === -1) {
      return { success: false, message: 'Kolom id_produk/nama_produk/harga_beli tidak ditemukan di Master_Produk' };
    }

    const timestamp = new Date().toISOString();
    let updated = 0;
    for (let i = 1; i < data.length; i++) {
      const id = (data[i][idIdx] || '').toString().trim();
      const nama = (data[i][namaIdx] || '').toString().trim().toLowerCase();
      const agg = (id && aggById[id]) || (nama && aggByName[nama]) || null;
      if (agg && agg.qty > 0) {
        const avg = agg.value / agg.qty;
        const current = parseFloat(data[i][hargaBeliIdx]) || 0;
        if (Math.round(avg) !== Math.round(current)) {
          produkSheet.getRange(i + 1, hargaBeliIdx + 1).setValue(avg);
          if (updatedIdx !== -1) produkSheet.getRange(i + 1, updatedIdx + 1).setValue(timestamp);
          updated++;
        }
      }
    }
    return { success: true, message: updated + ' produk diperbarui harga_beli-nya dari rata-rata Pembelian', updated: updated };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Computes a per-unit material cost for a product directly from its own
// Assembly_Entry history, for cases where there's no purchase history
// (it's not bought, it's produced) AND no HPP_Calculation record either -
// which is the normal situation for anything that only exists via the
// historical Assembly import, since that import doesn't run calculateHPP()
// per batch (live submitAssembly() does, but historical rows never went
// through it). Groups rows by batch_no since a batch's total material cost
// (sum of jumlah_raw_material x harga_raw_material across its rows) needs
// to be divided by THAT batch's own jumlah_produksi, not per raw-material
// row - then averages across batches, weighted by output quantity.
function getHargaRataRataAssembly(id_produk) {
  const all = getAll('Assembly_Entry');
  if (!all.success || !all.data.length) return 0;
  const idStr = (id_produk || '').toString().trim();
  if (!idStr) return 0;

  const rows = all.data.filter(r => (r.sku || '').toString().trim() === idStr);
  if (rows.length === 0) return 0;

  const batches = {};
  rows.forEach(r => {
    const batchNo = (r.batch_no || '').toString().trim() || ('__' + (r.id_assembly || Math.random()));
    if (!batches[batchNo]) {
      batches[batchNo] = { materialCost: 0, outputQty: parseFloat(r.jumlah_produksi) || 0 };
    }
    const jumlahRaw = parseFloat(r.jumlah_raw_material) || 0;
    const hargaRaw = parseFloat(r.harga_raw_material) || 0;
    batches[batchNo].materialCost += jumlahRaw * hargaRaw;
  });

  let totalCost = 0, totalQty = 0;
  Object.values(batches).forEach(b => {
    if (b.outputQty > 0) {
      totalCost += b.materialCost;
      totalQty += b.outputQty;
    }
  });

  return totalQty > 0 ? totalCost / totalQty : 0;
}

function getResep(id_produk) {
  const all = getAll('Master_Resep');
  if (!all.success) return all;
  const idStr = (id_produk === undefined || id_produk === null) ? '' : id_produk.toString().trim();

  // "bahan" and the recipe-lookup key are free text. Resolve Master_Produk
  // once up front so we can (a) verify the target product's name for an
  // exact-match fallback, and (b) enrich each row with the raw material's
  // own id_produk + price below.
  const produkAll = getAll('Master_Produk');
  const byId = {}, byName = {};
  if (produkAll.success) {
    produkAll.data.forEach(p => {
      if (p.id_produk !== undefined && p.id_produk !== null && p.id_produk !== '') byId[p.id_produk.toString()] = p;
      if (p.nama_produk) byName[p.nama_produk.toString().trim().toLowerCase()] = p;
    });
  }
  const targetProduk = byId[idStr] || null;
  const targetNameExact = targetProduk && targetProduk.nama_produk ? targetProduk.nama_produk.toString().trim().toLowerCase() : '';

  const records = all.data.filter(r => {
    // 1) Authoritative match: id_produk_jadi, either resolved automatically
    //    at import time (exact name match only) or fixed manually via the
    //    "Resep Mapping" tab. Compared as strings since sheet cells that
    //    look numeric come back as JS numbers.
    const idProdukJadi = (r.id_produk_jadi === undefined || r.id_produk_jadi === null) ? '' : r.id_produk_jadi.toString().trim();
    if (idProdukJadi && idProdukJadi === idStr) return true;

    // 2) Exact (not substring) name match as a fallback for rows that
    //    haven't been mapped yet. Substring matching was removed here - it
    //    was pairing unrelated recipes/products whenever one name happened
    //    to contain another (e.g. shared origin/flavor words), producing
    //    wrong matches instead of just missing ones.
    const namaResep = (r.nama_resep || '').toString().trim().toLowerCase();
    return !!targetNameExact && namaResep === targetNameExact;
  });

  const enriched = records.map(r => {
    const bahanKey = (r.bahan || '').toString().trim().toLowerCase();
    const bahanRaw = (r.bahan === undefined || r.bahan === null) ? '' : r.bahan.toString();
    const match = byId[bahanRaw] || byName[bahanKey] || null;
    const bahanId = match ? (match.id_produk || '').toString() : '';
    const isGB = /^gb/i.test(bahanId) || /^gb/i.test(bahanRaw);

    // Pricing priority, applied to EVERY ingredient (not just GB):
    // 1) Actual average purchase price from Pembelian, if this ingredient
    //    has purchase history - this is real ground-truth cost data.
    // 2) Its own latest computed HPP (HPP_Calculation), for ingredients
    //    that went through a live Assembly submission with full costing.
    // 3) Its own average material cost computed directly from Assembly_Entry
    //    history (covers historically-imported production that never went
    //    through calculateHPP(), which is most of it).
    // 4) Master_Produk's static harga_beli as a last-resort default.
    let hargaBahan = match ? (parseFloat(match.harga_beli) || 0) : 0;
    const avgHarga = getHargaRataRataPembelian(bahanId, r.bahan);
    if (avgHarga > 0) {
      hargaBahan = avgHarga;
    } else if (bahanId) {
      const hppResult = getHPP(bahanId);
      const hppHarga = hppResult.success && hppResult.data ? (parseFloat(hppResult.data.hpp_per_unit) || 0) : 0;
      if (hppHarga > 0) {
        hargaBahan = hppHarga;
      } else {
        const assemblyHarga = getHargaRataRataAssembly(bahanId);
        if (assemblyHarga > 0) hargaBahan = assemblyHarga;
      }
    }

    return Object.assign({}, r, {
      bahan_id: bahanId,
      harga_bahan: hargaBahan,
      // is_gb now only drives the frontend's manual-vs-auto quantity entry
      // (roasting shrinkage), it no longer affects which price source is used.
      is_gb: isGB
    });
  });

  return { success: true, data: enriched };
}

// Diagnostic helper: call ?action=debugResep&id_produk=XXX&callback=x to see
// exactly what getResep() is comparing for a given product - useful when a
// recipe "should" match but doesn't, without needing direct sheet access.
function debugResep(id_produk) {
  const produkAll = getAll('Master_Produk');
  const resepAll = getAll('Master_Resep');
  const idStr = (id_produk === undefined || id_produk === null) ? '' : id_produk.toString().trim();
  const target = produkAll.success ? produkAll.data.find(p => (p.id_produk || '').toString().trim() === idStr) : null;
  const result = getResep(id_produk);
  return {
    success: true,
    id_produk_dicari: idStr,
    produk_ditemukan_di_master: !!target,
    nama_produk: target ? target.nama_produk : null,
    total_baris_di_master_resep: resepAll.success ? resepAll.data.length : 0,
    jumlah_baris_matched: result.success ? result.data.length : 0,
    contoh_baris_resep: resepAll.success ? resepAll.data.slice(0, 15).map(r => ({
      nama_resep: r.nama_resep, id_produk_jadi: r.id_produk_jadi, bahan: r.bahan
    })) : [],
    hasil_match: result.success ? result.data : []
  };
}

// Groups Master_Resep by nama_resep (each recipe usually spans several rows,
// one per raw material) and reports whether it's currently linked to a real
// product, so the frontend can list every recipe with its match status and
// let the user fix the wrong/missing ones directly.
function listResepMapping() {
  const resepAll = getAll('Master_Resep');
  if (!resepAll.success) return resepAll;
  const produkAll = getAll('Master_Produk');
  const byId = {};
  if (produkAll.success) {
    produkAll.data.forEach(p => {
      if (p.id_produk !== undefined && p.id_produk !== null && p.id_produk !== '') byId[p.id_produk.toString().trim()] = p;
    });
  }

  const groups = {};
  const order = [];
  resepAll.data.forEach(r => {
    const nama = (r.nama_resep || '').toString();
    const key = nama.trim().toLowerCase();
    if (!groups[key]) {
      groups[key] = { nama_resep: nama, bahan_list: [], id_produk_jadi: (r.id_produk_jadi || '').toString().trim() };
      order.push(key);
    }
    groups[key].bahan_list.push((r.bahan || '').toString());
    // If rows disagree on id_produk_jadi, keep whichever one is non-blank.
    if (!groups[key].id_produk_jadi && r.id_produk_jadi) {
      groups[key].id_produk_jadi = r.id_produk_jadi.toString().trim();
    }
  });

  const rows = order.map(key => {
    const g = groups[key];
    const matched = g.id_produk_jadi ? byId[g.id_produk_jadi] : null;
    let status = 'BELUM_DIPETAKAN';
    if (g.id_produk_jadi && matched) status = 'OK';
    else if (g.id_produk_jadi && !matched) status = 'KODE_TIDAK_DITEMUKAN';
    return {
      nama_resep: g.nama_resep,
      bahan_list: g.bahan_list,
      id_produk_jadi: g.id_produk_jadi,
      nama_produk_jadi: matched ? matched.nama_produk : '',
      status: status
    };
  });

  return { success: true, data: rows };
}

// Sets id_produk_jadi for every Master_Resep row sharing the given
// nama_resep in one go (a recipe normally has several rows, one per raw
// material, and they should all point at the same finished product).
// Creates a new Master_Produk row named exactly after a recipe (for recipes
// that turned out to be legitimately new products, not a naming mismatch),
// then links it via setResepProdukJadiByName. Idempotent: if a product with
// this exact name already exists, reuses it instead of creating a duplicate.
// Generic "add new master data entry" - covers Produk, Kemasan, Resep,
// Customer, Supplier, Salesman, COA from a single endpoint instead of one
// bespoke function per type, since create() already handles ID generation
// and field mapping uniformly. Whitelisted to master tables only (never
// transaction tables like Pembelian_App), and checks for an existing entry
// with the same name first so accidentally re-adding something creates a
// clear "already exists" response instead of a silent near-duplicate.
const MASTER_DATA_TABLES = {
  Master_Produk: 'nama_produk',
  Master_Kemasan: 'nama_kemasan',
  Master_Resep: 'nama_resep',
  Master_Customer: 'nama_customer',
  Master_Supplier: 'nama_supplier',
  Master_Salesman: 'nama_salesman',
  Master_COA: 'nama_akun'
};

function submitMasterData(table, data) {
  try {
    if (!MASTER_DATA_TABLES[table]) {
      return { success: false, message: 'Tabel tidak dikenali atau bukan data master: ' + table };
    }
    const nameField = MASTER_DATA_TABLES[table];
    const namaValue = (data[nameField] || '').toString().trim();
    if (!namaValue) {
      return { success: false, message: 'Nama tidak boleh kosong' };
    }

    const existingAll = getAll(table);
    if (existingAll.success) {
      const dup = existingAll.data.find(r => (r[nameField] || '').toString().trim().toLowerCase() === namaValue.toLowerCase());
      if (dup) {
        return { success: false, message: namaValue + ' sudah ada di ' + table, existing: dup };
      }
    }

    data.status = data.status || 'Aktif';
    const result = create(table, data);
    return { success: true, data: result.data, table: table };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function createProdukFromResep(nama_resep, tipe, kategori, satuan) {
  try {
    const namaProduk = (nama_resep || '').toString().trim();
    if (!namaProduk) return { success: false, message: 'nama_resep kosong' };

    const produkAll = getAll('Master_Produk');
    if (!produkAll.success) return produkAll;
    const existing = produkAll.data.find(p => (p.nama_produk || '').toString().trim().toLowerCase() === namaProduk.toLowerCase());

    let idProduk;
    if (existing) {
      idProduk = existing.id_produk;
    } else {
      const newProduk = {
        id_produk: generateId('PRD'),
        nama_produk: namaProduk,
        tipe: tipe || 'Assembly',
        kategori: kategori || 'Lainnya',
        satuan: satuan || 'pcs',
        harga_beli: 0,
        harga_jual: 0,
        stok: 0,
        stok_min: 0,
        status: 'Aktif'
      };
      create('Master_Produk', newProduk);
      idProduk = newProduk.id_produk;
    }

    const mapResult = setResepProdukJadiByName(nama_resep, idProduk);
    return {
      success: true,
      message: (existing ? 'Produk sudah ada, dikaitkan: ' : 'Produk baru dibuat & dikaitkan: ') + namaProduk + ' (' + idProduk + ')',
      id_produk: idProduk,
      created_new: !existing,
      baris_resep_diperbarui: mapResult.count || 0
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}


function setResepProdukJadiByName(nama_resep, id_produk_jadi) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Master_Resep');
    if (!sheet) return { success: false, message: 'Sheet Master_Resep not found' };
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const namaIdx = headers.indexOf('nama_resep');
    const jadiIdx = headers.indexOf('id_produk_jadi');
    const updatedIdx = headers.indexOf('updated_at');
    if (namaIdx === -1 || jadiIdx === -1) {
      return { success: false, message: 'Kolom nama_resep/id_produk_jadi tidak ditemukan' };
    }
    const targetKey = (nama_resep || '').toString().trim().toLowerCase();
    const timestamp = new Date().toISOString();
    let updated = 0;
    for (let i = 1; i < data.length; i++) {
      const rowKey = (data[i][namaIdx] || '').toString().trim().toLowerCase();
      if (rowKey === targetKey) {
        sheet.getRange(i + 1, jadiIdx + 1).setValue(id_produk_jadi);
        if (updatedIdx !== -1) sheet.getRange(i + 1, updatedIdx + 1).setValue(timestamp);
        updated++;
      }
    }
    return { success: updated > 0, message: updated + ' baris diperbarui', count: updated };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}


function getProdukByType(tipe) {
  const all = getAll('Master_Produk');
  if (!all.success) return all;
  const records = all.data.filter(r => r.tipe === tipe);
  return { success: true, data: records };
}

// Bulk-generates Stock_Movement rows from Assembly_Entry (batch output =
// Masuk, each raw material row = Keluar) and Penjualan_App (sold items =
// Keluar) history. Needed because historical imports never called
// submitMovement() per row (too slow at bulk scale) - without this, stock
// levels only reflect whatever was submitted live through the app, not the
// full production/sales history, making any stock check meaningless.
// Safe to re-run: dedup key (batch_no/id_penjualan + tipe + id_produk)
// matches the same convention live submitAssembly()/submitPenjualan()
// already use via submitMovement(), so this never double-counts a movement
// that a live submission already created.
function generateStockMovementsFromHistory() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const stockSheet = ss.getSheetByName('Stock_Movement');
    if (!stockSheet) return { success: false, message: 'Sheet Stock_Movement not found' };

    const existingRows = stockSheet.getLastRow() > 1
      ? stockSheet.getRange(2, 1, stockSheet.getLastRow() - 1, stockSheet.getLastColumn()).getValues()
      : [];
    const sHeaders = stockSheet.getRange(1, 1, 1, stockSheet.getLastColumn()).getValues()[0];
    const refIdx = sHeaders.indexOf('referensi');
    const tipeIdx = sHeaders.indexOf('tipe');
    const produkIdxS = sHeaders.indexOf('id_produk');
    const existingKeys = new Set(
      (refIdx !== -1 && tipeIdx !== -1 && produkIdxS !== -1)
        ? existingRows.map(row => [(row[refIdx] || '').toString().trim(), row[tipeIdx], (row[produkIdxS] || '').toString().trim()].join('||'))
        : []
    );

    const assemblyAll = getAll('Assembly_Entry', ss);
    const penjualanAll = getAll('Penjualan_App', ss);
    const produkAll = getAll('Master_Produk', ss);
    const produkByName = {};
    if (produkAll.success) {
      produkAll.data.forEach(p => { if (p.nama_produk) produkByName[p.nama_produk.toString().trim().toLowerCase()] = p.id_produk; });
    }

    const toCreate = [];
    let assemblyMasuk = 0, assemblyKeluar = 0, penjualanKeluar = 0, penjualanTanpaProduk = 0;

    if (assemblyAll.success) {
      assemblyAll.data.forEach(r => {
        const batchNo = (r.batch_no || '').toString().trim();
        const sku = (r.sku || '').toString().trim();
        if (!batchNo) return;

        const rawMaterialId = (produkByName[(r.raw_material || '').toString().trim().toLowerCase()] || r.raw_material || '').toString().trim();
        const keluarKey = [batchNo, 'Keluar', rawMaterialId].join('||');
        if (rawMaterialId && !existingKeys.has(keluarKey)) {
          toCreate.push({
            id_movement: generateId('MOV'), tanggal: r.tanggal, id_produk: rawMaterialId, nama_produk: r.raw_material,
            tipe: 'Keluar', qty_in: 0, qty_out: parseFloat(r.jumlah_raw_material) || 0, saldo: 0,
            referensi: batchNo, keterangan: 'Assembly: ' + r.nama_barang
          });
          existingKeys.add(keluarKey);
          assemblyKeluar++;
        }

        const masukKey = [batchNo, 'Masuk', sku].join('||');
        if (sku && !existingKeys.has(masukKey)) {
          toCreate.push({
            id_movement: generateId('MOV'), tanggal: r.tanggal, id_produk: sku, nama_produk: r.nama_barang,
            tipe: 'Masuk', qty_in: parseFloat(r.jumlah_produksi) || 0, qty_out: 0, saldo: 0,
            referensi: batchNo, keterangan: 'Hasil Assembly batch ' + batchNo
          });
          existingKeys.add(masukKey);
          assemblyMasuk++;
        }
      });
    }

    if (penjualanAll.success) {
      penjualanAll.data.forEach(r => {
        const idPenjualan = (r.id_penjualan || '').toString().trim();
        const namaBarang = (r.nama_barang || '').toString().trim();
        if (!namaBarang) { penjualanTanpaProduk++; return; }
        const idProduk = (produkByName[namaBarang.toLowerCase()] || namaBarang).toString().trim();
        const key = [idPenjualan, 'Keluar', idProduk].join('||');
        if (existingKeys.has(key)) return;
        toCreate.push({
          id_movement: generateId('MOV'), tanggal: r.tanggal, id_produk: idProduk, nama_produk: namaBarang,
          tipe: 'Keluar', qty_in: 0, qty_out: parseFloat(r.jumlah) || 0, saldo: 0,
          referensi: idPenjualan, keterangan: 'Penjualan ke ' + (r.customer || '')
        });
        existingKeys.add(key);
        penjualanKeluar++;
      });
    }

    const bulkResult = bulkCreate('Stock_Movement', ss, toCreate);
    const created = bulkResult.success ? bulkResult.count : 0;

    return {
      success: true, total_dibuat: created,
      assembly_masuk: assemblyMasuk, assembly_keluar: assemblyKeluar,
      penjualan_keluar: penjualanKeluar, penjualan_dilewati_tanpa_nama_barang: penjualanTanpaProduk
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Lists real Assembly_Entry batches for a product (deduped by batch_no),
// so a sale can reference an actual traceable production batch instead of
// a free-typed batch number that might not correspond to anything real.
// Matches a product to its packaging in Master_Kemasan. There's no direct
// link between a product and a kemasan record, so this extracts the size
// number from the product name (e.g. "RB Arabika Ciwidey Natural 250gr" ->
// "250") and matches it against Master_Kemasan's kapasitas field. Returns
// the candidates considered, not just the final pick, so if this heuristic
// is wrong for the real data it's immediately obvious why.
// One-time backfill for Master_Kemasan rows that were typed directly into
// the sheet and so never got an id_kemasan - create() already auto-
// generates one for anything submitted through the app, so this only
// needs to run once for the pre-existing blank rows.
// Call: ?action=backfillKemasanIds&callback=x
function backfillKemasanIds() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Master_Kemasan');
    if (!sheet) return { success: false, message: 'Sheet Master_Kemasan not found' };
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: true, updated: 0 };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const idIdx = headers.indexOf('id_kemasan');
    if (idIdx === -1) return { success: false, message: 'Kolom id_kemasan tidak ditemukan' };

    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    let updated = 0;
    const filled = [];
    data.forEach((row, i) => {
      if (!row[idIdx]) {
        const newId = generateId('KEM');
        sheet.getRange(i + 2, idIdx + 1).setValue(newId);
        filled.push({ baris: i + 2, nama_kemasan: row[headers.indexOf('nama_kemasan')], id_baru: newId });
        updated++;
      }
    });
    return { success: true, updated: updated, detail: filled };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Detects packaged-size products (e.g. "250 gr - RB Arabica Ciwidey
// Natural") and, for each, resolves: the base product's current HPP per kg,
// and the kemasan (packaging) used and its price - preferring the ACTUAL
// values from that product's own most recent Assembly batch (real
// production data), falling back to name-stripping + average purchase
// price if no batch history exists yet. Requires an explicit unit word
// (gr/gram/kg) right after the number, so product codes with embedded
// numbers (e.g. "RB Arabika Jawa Barat105") are never mistaken for a size.
function generatePricelist(markupPercent) {
  try {
    const produkAll = getAll('Master_Produk');
    const kemasanAll = getAll('Master_Kemasan');
    const assemblyAll = getAll('Assembly_Entry');
    const pembelianAll = getAll('Pembelian_App');
    if (!produkAll.success) return produkAll;

    const MARKUP = markupPercent !== undefined && markupPercent !== '' ? parseFloat(markupPercent) : 20;

    const produkByNameExact = {};
    produkAll.data.forEach(p => {
      const nama = (p.nama_produk || '').toString().trim();
      if (nama) produkByNameExact[nama.toLowerCase()] = p;
    });
    const kemasanNameSet = {};
    if (kemasanAll.success) {
      kemasanAll.data.forEach(k => { if (k.nama_kemasan) kemasanNameSet[k.nama_kemasan.toString().trim().toLowerCase()] = k; });
    }
    const pembelianPriceAgg = {};
    if (pembelianAll.success) {
      pembelianAll.data.forEach(r => {
        const nama = (r.nama_barang || '').toString().trim().toLowerCase();
        const qty = parseFloat(r.jumlah) || 0;
        const harga = parseFloat(r.harga_satuan) || 0;
        if (!nama || qty <= 0) return;
        if (!pembelianPriceAgg[nama]) pembelianPriceAgg[nama] = { qty: 0, value: 0 };
        pembelianPriceAgg[nama].qty += qty;
        pembelianPriceAgg[nama].value += qty * harga;
      });
    }
    const avgPembelianPrice = nama => {
      const agg = pembelianPriceAgg[(nama || '').toString().trim().toLowerCase()];
      return agg && agg.qty > 0 ? agg.value / agg.qty : 0;
    };

    const rows = [];
    produkAll.data.forEach(produk => {
      const namaProduk = (produk.nama_produk || '').toString();
      const sizeMatch = namaProduk.match(/(\d+)\s*(gram|gr|kg)\b/i);
      if (!sizeMatch) return; // not a packaged-size product
      const sizeNumber = parseFloat(sizeMatch[1]);
      const sizeUnit = sizeMatch[2].toLowerCase();
      const beratKg = sizeUnit === 'kg' ? sizeNumber : sizeNumber / 1000;

      let baseProduk = null, kemasanNama = '', hargaKemasan = 0;

      // Prefer the product's own most recent Assembly batch - real
      // production data beats a name-based guess.
      if (assemblyAll.success) {
        const idStr = (produk.id_produk || '').toString().trim();
        const batchesForSku = assemblyAll.data.filter(r => (r.sku || '').toString().trim() === idStr);
        if (batchesForSku.length > 0) {
          const mostRecent = batchesForSku.reduce((a, b) => new Date(a.tanggal) > new Date(b.tanggal) ? a : b);
          const rowsInBatch = batchesForSku.filter(r => r.batch_no === mostRecent.batch_no);
          rowsInBatch.forEach(row => {
            const rawNameLower = (row.raw_material || '').toString().trim().toLowerCase();
            if (kemasanNameSet[rawNameLower]) {
              kemasanNama = row.raw_material;
              hargaKemasan = parseFloat(row.harga_raw_material) || 0;
            } else if (!baseProduk) {
              baseProduk = produkByNameExact[rawNameLower] || null;
            }
          });
        }
      }

      // Fallback: strip the size annotation from the name and look for a
      // Master_Produk entry matching what's left.
      if (!baseProduk) {
        const stripped = namaProduk
          .replace(/^\s*\d+\s*(gram|gr|kg)\s*-?\s*/i, '')
          .replace(/-?\s*\d+\s*(gram|gr|kg)\s*$/i, '')
          .trim();
        baseProduk = produkByNameExact[stripped.toLowerCase()] || null;
      }
      if (!kemasanNama && kemasanAll.success) {
        const numMatches = kemasanAll.data.filter(k => (k.kapasitas || '').toString().replace(/\D/g, '') === Math.round(sizeUnit === 'kg' ? sizeNumber * 1000 : sizeNumber).toString());
        const match = numMatches.find(k => (k.satuan || '').toString().toLowerCase().startsWith('g')) || numMatches[0];
        if (match) {
          kemasanNama = match.nama_kemasan;
          hargaKemasan = parseFloat(match.harga) || avgPembelianPrice(match.nama_kemasan);
        }
      }

      if (!baseProduk) return; // can't determine a cost basis - skip rather than guess

      const hppResult = getHPP(baseProduk.id_produk);
      const hppPerKg = hppResult.success && hppResult.data ? (parseFloat(hppResult.data.hpp_per_unit) || 0) : 0;

      const baseCost = hppPerKg * beratKg;
      const subtotal = baseCost + hargaKemasan;
      const hargaJual = kemasanNama ? subtotal * (1 + MARKUP / 100) : subtotal;

      rows.push({
        id_produk: produk.id_produk,
        nama_produk: namaProduk,
        berat_kg: beratKg,
        hpp_per_kg: parseFloat(hppPerKg.toFixed(2)),
        nama_kemasan: kemasanNama,
        harga_kemasan: parseFloat(hargaKemasan.toFixed(2)),
        markup_percent: MARKUP,
        harga_jual: Math.round(hargaJual)
      });
    });

    rows.sort((a, b) => a.nama_produk.localeCompare(b.nama_produk));
    return { success: true, data: rows };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Persists an edited pricelist (replaces whatever was saved before, since
// the pricelist represents current-state pricing, not a historical log).
function savePricelist(items, isFirstChunk) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let parsed = items;
    if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch (e) { parsed = []; } }
    if (!Array.isArray(parsed)) return { success: false, message: 'Data pricelist tidak valid' };

    // nama_produk is no longer sent from the frontend (payload trimmed to
    // fix a save failure caused by the full pricelist exceeding the URL
    // length limit) - looked up here instead by id_produk.
    const produkAll = getAll('Master_Produk', ss);
    const namaById = {};
    if (produkAll.success) produkAll.data.forEach(p => { if (p.id_produk) namaById[p.id_produk.toString().trim()] = p.nama_produk; });

    const sheet = ss.getSheetByName('Price_List');
    if (!sheet) return { success: false, message: 'Sheet Price_List not found' };
    // Only clear existing data on the FIRST chunk of a multi-part save -
    // subsequent chunks append instead. Defaults to clearing (safe for a
    // single, non-chunked call) unless explicitly told this is a later chunk.
    if (isFirstChunk !== 'false') {
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
    }

    const toCreate = parsed.map(r => ({
      id_pricelist: generateId('PRL'),
      id_produk: r.id_produk,
      nama_produk: namaById[(r.id_produk || '').toString().trim()] || r.nama_produk || '',
      berat_kg: parseFloat(r.berat_kg) || 0,
      hpp_per_kg: parseFloat(r.hpp_per_kg) || 0,
      nama_kemasan: r.nama_kemasan || '',
      harga_kemasan: parseFloat(r.harga_kemasan) || 0,
      markup_percent: parseFloat(r.markup_percent) || 0,
      harga_jual: parseFloat(r.harga_jual) || 0
    }));
    const bulkResult = bulkCreate('Price_List', ss, toCreate);
    return { success: true, saved: bulkResult.success ? bulkResult.count : 0 };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Looks up the saved (possibly manually edited) selling price for a
// product - used by Penjualan to auto-fill harga_satuan.
function getPricelistPrice(id_produk) {
  const all = getAll('Price_List');
  if (!all.success) return all;
  const idStr = (id_produk || '').toString().trim();
  const row = all.data.find(r => (r.id_produk || '').toString().trim() === idStr);
  return { success: true, data: row || null };
}

function getKemasanForProduk(id_produk) {
  try {
    const produkAll = getAll('Master_Produk');
    const kemasanAll = getAll('Master_Kemasan');
    const assemblyAll = getAll('Assembly_Entry');
    const penjualanAll = getAll('Penjualan_App');
    if (!produkAll.success) return produkAll;
    if (!kemasanAll.success) return kemasanAll;

    const idStr = (id_produk || '').toString().trim();
    const produk = produkAll.data.find(p => (p.id_produk || '').toString().trim() === idStr);
    if (!produk) return { success: true, data: null, message: 'Produk tidak ditemukan' };

    const namaProduk = (produk.nama_produk || '').toString();
    const candidates = kemasanAll.data.filter(k => (k.status || '').toString().toLowerCase() !== 'nonaktif' && k.nama_kemasan);
    const kemasanNameSet = {};
    candidates.forEach(k => { kemasanNameSet[(k.nama_kemasan || '').toString().trim().toLowerCase()] = k; });

    let match = null;
    let sumberMatch = null;

    // 1) Most direct signal: what Kemasan was actually written down the
    // last time this exact product was sold. If it's been sold before,
    // this is real recorded data, not a guess.
    if (penjualanAll.success) {
      const priorSales = penjualanAll.data
        .filter(r => (r.nama_barang || '').toString().trim().toLowerCase() === namaProduk.toLowerCase() && (r.kemasan || '').toString().trim())
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      if (priorSales[0]) {
        const kemasanText = priorSales[0].kemasan.toString().trim();
        const known = kemasanNameSet[kemasanText.toLowerCase()];
        match = known ? { id_kemasan: known.id_kemasan, nama_kemasan: known.nama_kemasan, kapasitas: known.kapasitas, satuan: known.satuan } : { id_kemasan: '', nama_kemasan: kemasanText, kapasitas: '', satuan: '' };
        sumberMatch = 'histori_penjualan_produk_ini';
      }
    }

    // 2) Packaging supplies (Flat Bottom Valve, Botol, etc.) are bought via
    // Pembelian and consumed as a raw_material row during the packaging
    // Assembly step - the most recent batch for this SKU shows what was
    // actually used.
    let batchChecked = null;
    if (!match && assemblyAll.success) {
      const batchesForSku = assemblyAll.data.filter(r => (r.sku || '').toString().trim() === idStr);
      if (batchesForSku.length > 0) {
        const mostRecentBatch = batchesForSku.reduce((a, b) => new Date(a.tanggal) > new Date(b.tanggal) ? a : b);
        batchChecked = mostRecentBatch.batch_no;
        const rowsInBatch = batchesForSku.filter(r => r.batch_no === mostRecentBatch.batch_no);
        for (const row of rowsInBatch) {
          const rawNameLower = (row.raw_material || '').toString().trim().toLowerCase();
          if (kemasanNameSet[rawNameLower]) { match = kemasanNameSet[rawNameLower]; sumberMatch = 'assembly_entry_batch_terakhir'; break; }
        }
      }
    }

    // 3) Last resort: guess from a size number in the product's own name.
    const sizeMatch = namaProduk.match(/(\d+)\s*(gram|gr|g|kg|ml|l)?/i);
    const sizeNumber = sizeMatch ? sizeMatch[1] : null;
    const normalizeUnit = u => {
      if (!u) return null;
      const lower = u.toString().toLowerCase();
      if (lower === 'g' || lower === 'gr' || lower === 'gram') return 'gr';
      if (lower === 'kg') return 'kg';
      if (lower === 'ml') return 'ml';
      if (lower === 'l') return 'l';
      return lower;
    };
    const sizeUnit = sizeMatch ? normalizeUnit(sizeMatch[2]) : null;
    if (!match && sizeNumber) {
      const numMatches = candidates.filter(k => (k.kapasitas || '').toString().replace(/\D/g, '') === sizeNumber);
      match = (sizeUnit ? numMatches.find(k => normalizeUnit(k.satuan) === sizeUnit) : null) || numMatches[0] || null;
      if (match) sumberMatch = 'tebakan_ukuran_dari_nama_produk';
    }

    return {
      success: true,
      data: match,
      sumber_match: sumberMatch,
      batch_yang_dicek: batchChecked,
      nama_produk: namaProduk,
      ukuran_terdeteksi_dari_nama: sizeNumber,
      satuan_terdeteksi_dari_nama: sizeUnit,
      semua_kemasan_aktif: candidates.map(k => ({ nama_kemasan: k.nama_kemasan, kapasitas: k.kapasitas, satuan: k.satuan }))
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function getBatchesForProduk(id_produk) {
  const all = getAll('Assembly_Entry');
  if (!all.success) return all;
  const idStr = (id_produk || '').toString().trim();
  if (!idStr) return { success: true, data: [] };

  const seen = {};
  all.data.forEach(r => {
    if ((r.sku || '').toString().trim() !== idStr) return;
    const batchNo = (r.batch_no || '').toString().trim();
    if (!batchNo) return;
    if (!seen[batchNo]) {
      seen[batchNo] = { batch_no: batchNo, tanggal: r.tanggal, jumlah_produksi: parseFloat(r.jumlah_produksi) || 0, terjual: 0 };
    }
  });

  // Subtract what's already been sold FROM each specific batch (matched by
  // batch_no on the sale itself), so only batches with real remaining
  // stock are offered - proper FIFO instead of "most recent batch
  // regardless of whether it's already sold out".
  const penjualanAll = getAll('Penjualan_App');
  if (penjualanAll.success) {
    penjualanAll.data.forEach(r => {
      const batchNo = (r.batch_no || '').toString().trim();
      if (batchNo && seen[batchNo]) {
        seen[batchNo].terjual += parseFloat(r.jumlah) || 0;
      }
    });
  }

  const list = Object.values(seen)
    .map(b => ({ batch_no: b.batch_no, tanggal: b.tanggal, jumlah_produksi: b.jumlah_produksi, terjual: b.terjual, sisa: b.jumlah_produksi - b.terjual }))
    .filter(b => b.sisa > 0)
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)); // oldest first = FIFO
  return { success: true, data: list };
}

// Generic auto-increment for document/invoice numbers: finds the highest
// existing value in the given field, extracts its trailing numeric part,
// and returns that +1 - preserving whatever prefix and zero-padding the
// highest record used (e.g. "INV-0045" -> "INV-0046", "PB2026-7" -> "PB2026-8").
// Used by Pembelian (No Dokumen), Penjualan (No Invoice), and Kas Masuk
// (No Dokumen).
function getNextDocNumber(table, fieldName) {
  try {
    const all = getAll(table);
    if (!all.success) return { success: false, message: 'Gagal membaca ' + table };
    let maxNum = 0, prefix = '', suffix = '', digitLength = 0, found = false;
    all.data.forEach(row => {
      const val = (row[fieldName] || '').toString().trim();
      if (!val) return;
      const match = val.match(/^(\D*)(\d+)(\D*)$/);
      if (!match) return;
      const num = parseInt(match[2], 10);
      if (num >= maxNum) {
        maxNum = num;
        prefix = match[1];
        suffix = match[3];
        digitLength = match[2].length;
        found = true;
      }
    });
    const nextNum = maxNum + 1;
    const nextNumStr = digitLength > 0 ? nextNum.toString().padStart(digitLength, '0') : nextNum.toString();
    return { success: true, next: found ? (prefix + nextNumStr + suffix) : '1', is_first: !found };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Computes stock for every product in ONE pass across the three source
// tables, instead of maintaining a separate Stock_Movement ledger that has
// to be regenerated (and can silently go stale/duplicate) every time
// Assembly_Entry/Pembelian_App/Penjualan_App get reset and reimported -
// which happened repeatedly during setup. Live computation means stock is
// always correct for whatever's currently in those three tables, no
// separate regeneration step required.
// Masuk: Pembelian (purchased items) + Assembly output (what a batch produced).
// Keluar: Assembly raw material consumption + Penjualan (sold items).
function computeStockLedger() {
  const produkAll = getAll('Master_Produk');
  const kemasanAll = getAll('Master_Kemasan');
  const produkByName = {};
  const produkNameById = {};
  const itemKategori = {};
  if (produkAll.success) {
    produkAll.data.forEach(p => {
      const id = (p.id_produk || '').toString().trim();
      const nama = (p.nama_produk || '').toString().trim();
      if (nama && id) { produkByName[nama.toLowerCase()] = id; produkNameById[id] = nama; itemKategori[id] = p.kategori || ''; }
    });
  }
  // Kemasan (packaging supplies like pouches/bottles) live in a separate
  // catalog from Master_Produk, but still need to participate in the same
  // stock ledger - they're bought via Pembelian and consumed at the point
  // of sale (jumlah_kemasan on Penjualan_App). Without registering them
  // here, they never resolved to anything in the ledger at all, so their
  // stock was completely untracked regardless of purchases or sales.
  if (kemasanAll.success) {
    kemasanAll.data.forEach(k => {
      const nama = (k.nama_kemasan || '').toString().trim();
      if (!nama) return;
      const id = (k.id_kemasan || '').toString().trim() || ('KEM_' + nama.toUpperCase().replace(/\s+/g, '_'));
      if (!produkByName[nama.toLowerCase()]) {
        produkByName[nama.toLowerCase()] = id;
        produkNameById[id] = nama;
        itemKategori[id] = 'Kemasan';
      }
    });
  }
  const resolveId = namaOrId => {
    const s = (namaOrId || '').toString().trim();
    if (!s) return '';
    return produkByName[s.toLowerCase()] || s;
  };

  const ledger = {};
  const touch = id => { if (!ledger[id]) ledger[id] = { masuk: 0, keluar: 0, movements: [] }; return ledger[id]; };

  const pembelianAll = getAll('Pembelian_App');
  if (pembelianAll.success) {
    pembelianAll.data.forEach(r => {
      const kodeLower = (r.kode_transaksi || '').toString().trim().toLowerCase();
      // Sample giveaways get an ADDITIONAL Pembelian entry purely for
      // expense/financial tracking (marketing cost) - the original
      // Penjualan_App row for the same giveaway stays in place and already
      // accounts for the stock reduction, so this entry must be
      // stock-neutral or the same giveaway gets subtracted twice.
      // Pembayaran Hutang is a debt repayment, not a goods movement.
      if (kodeLower === 'sample' || kodeLower === 'pembayaran hutang') return;
      const id = (r.id_produk || '').toString().trim() || resolveId(r.nama_barang);
      const qty = parseFloat(r.jumlah) || 0;
      if (!id || qty <= 0) return;
      const l = touch(id);
      l.masuk += qty;
      l.movements.push({ tanggal: r.tanggal, tipe: 'Masuk', qty: qty, keterangan: 'Pembelian dari ' + (r.nama_supplier || '') });
    });
  }

  // Opening stock (Jan 1, 2026) - the properly-valued starting inventory,
  // superseding the earlier qty-only "Stock Awal" Pembelian entries.
  const saldoAwalStockAll = getAll('Saldo_Awal_Stock');
  if (saldoAwalStockAll.success) {
    saldoAwalStockAll.data.forEach(r => {
      const id = (r.id_produk || '').toString().trim() || resolveId(r.nama_barang);
      const qty = parseFloat(r.qty) || 0;
      if (!id || qty <= 0) return;
      const l = touch(id);
      l.masuk += qty;
      l.movements.push({ tanggal: r.tanggal, tipe: 'Masuk', qty: qty, keterangan: 'Saldo awal stock (1 Jan 2026)' });
    });
  }

  const assemblyAll = getAll('Assembly_Entry');
  if (assemblyAll.success) {
    assemblyAll.data.forEach(r => {
      const skuId = (r.sku || '').toString().trim();
      const qtyOut = parseFloat(r.jumlah_produksi) || 0;
      if (skuId && qtyOut > 0) {
        const l = touch(skuId);
        l.masuk += qtyOut;
        l.movements.push({ tanggal: r.tanggal, tipe: 'Masuk', qty: qtyOut, keterangan: 'Hasil Assembly batch ' + r.batch_no });
      }
      const rawId = resolveId(r.raw_material);
      const qtyRaw = parseFloat(r.jumlah_raw_material) || 0;
      if (rawId && qtyRaw > 0) {
        const l = touch(rawId);
        l.keluar += qtyRaw;
        l.movements.push({ tanggal: r.tanggal, tipe: 'Keluar', qty: qtyRaw, keterangan: 'Dipakai Assembly batch ' + r.batch_no + ' -> ' + r.nama_barang });
      }
    });
  }

  const penjualanAll = getAll('Penjualan_App');
  if (penjualanAll.success) {
    penjualanAll.data.forEach(r => {
      const namaBarang = (r.nama_barang || '').toString().trim();
      const qty = parseFloat(r.jumlah) || 0;
      if (namaBarang && qty > 0) {
        const id = resolveId(namaBarang);
        if (id) {
          const l = touch(id);
          l.keluar += qty;
          l.movements.push({ tanggal: r.tanggal, tipe: 'Keluar', qty: qty, keterangan: 'Penjualan ke ' + (r.customer || '') });
        }
      }
      // Kemasan consumed for this sale - a pouch/bottle used up per unit sold.
      const kemasanNama = (r.kemasan || '').toString().trim();
      const qtyKemasan = parseFloat(r.jumlah_kemasan) || 0;
      if (kemasanNama && qtyKemasan > 0) {
        const kId = resolveId(kemasanNama);
        if (kId) {
          const l = touch(kId);
          l.keluar += qtyKemasan;
          l.movements.push({ tanggal: r.tanggal, tipe: 'Keluar', qty: qtyKemasan, keterangan: 'Kemasan terpakai - penjualan ke ' + (r.customer || '') });
        }
      }
    });
  }

  // Stock Opname corrections: a physical count can differ from the system
  // balance, and that difference gets logged to Stock_Movement (referensi
  // starting with "OPN") - but was never actually being read back into the
  // balance calculation, making corrections invisible in the Stock tab.
  // Only OPN-referenced entries are included here, not the whole
  // Stock_Movement table - every normal Pembelian/Penjualan/Assembly
  // submission ALSO writes an audit-log entry there for the same
  // transaction, and counting those too would double the real total.
  const movementAll = getAll('Stock_Movement');
  if (movementAll.success) {
    movementAll.data.forEach(r => {
      const referensi = (r.referensi || '').toString().trim();
      if (!referensi.startsWith('OPN')) return;
      const id = (r.id_produk || '').toString().trim() || resolveId(r.nama_produk);
      if (!id) return;
      const qtyIn = parseFloat(r.qty_in) || 0;
      const qtyOut = parseFloat(r.qty_out) || 0;
      const l = touch(id);
      if (qtyIn > 0) { l.masuk += qtyIn; l.movements.push({ tanggal: r.tanggal, tipe: 'Masuk', qty: qtyIn, keterangan: 'Koreksi Stock Opname' }); }
      if (qtyOut > 0) { l.keluar += qtyOut; l.movements.push({ tanggal: r.tanggal, tipe: 'Keluar', qty: qtyOut, keterangan: 'Koreksi Stock Opname' }); }
    });
  }

  return { ledger: ledger, produkNameById: produkNameById, itemKategori: itemKategori };
}

function getStock(id_produk) {
  const idStr = (id_produk === undefined || id_produk === null) ? '' : id_produk.toString().trim();
  if (!idStr) return { success: true, data: { id_produk: idStr, saldo: 0, movements: [] } };
  const { ledger, produkNameById } = computeStockLedger();
  const l = ledger[idStr] || { masuk: 0, keluar: 0, movements: [] };
  const sorted = l.movements.slice().sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  return { success: true, data: { id_produk: idStr, nama_produk: produkNameById[idStr] || '', saldo: l.masuk - l.keluar, masuk: l.masuk, keluar: l.keluar, movements: sorted.slice(0, 15) } };
}

// Full stock overview for every product - powers the Stock tab.
// Stock broken down by batch: for each Assembly-produced item, shows every
// batch_no with how much it produced, how much has been sold FROM that
// specific batch, and what's left - e.g. "RB Robusta Temanggung: batch
// 2107-RB01 sisa 8kg, batch 1507-RB01 sisa 0kg (habis)". Purchased-only
// items with no Assembly batches (raw materials bought but not yet used)
// show as a single aggregate row instead, since they were never split into
// batches to begin with.
// Traces exactly where a product's stock comes from and goes to: total
// purchased, total produced via Assembly, consumption grouped by what it
// was used to make (so "GB used for RB" vs "used for Houseblend" show up
// as separate lines instead of one opaque total), total sold, and the
// resulting balance. Built to verify the GB -> RB -> Houseblend -> pack
// chain concretely instead of guessing where a discrepancy might be.
// Call: ?action=getStockTrace&nama_atau_id=GB Robusta Temanggung&callback=x
function getStockTrace(namaAtauId) {
  try {
    const produkAll = getAll('Master_Produk');
    const kemasanAll = getAll('Master_Kemasan');
    const assemblyAll = getAll('Assembly_Entry');
    const penjualanAll = getAll('Penjualan_App');
    const pembelianAll = getAll('Pembelian_App');
    if (!produkAll.success) return produkAll;

    const target = (namaAtauId || '').toString().trim().toLowerCase();
    if (!target) return { success: false, message: 'nama_atau_id kosong' };

    const produkByName = {};
    produkAll.data.forEach(p => {
      const id = (p.id_produk || '').toString().trim();
      const nama = (p.nama_produk || '').toString().trim();
      if (nama && id) produkByName[nama.toLowerCase()] = id;
    });
    if (kemasanAll.success) {
      kemasanAll.data.forEach(k => {
        const nama = (k.nama_kemasan || '').toString().trim();
        if (nama && !produkByName[nama.toLowerCase()]) produkByName[nama.toLowerCase()] = (k.id_kemasan || '').toString().trim() || ('KEM_' + nama.toUpperCase().replace(/\s+/g, '_'));
      });
    }
    const resolveId = namaOrId => {
      const s = (namaOrId || '').toString().trim();
      if (!s) return '';
      return produkByName[s.toLowerCase()] || s;
    };

    const idStr = produkByName[target] || namaAtauId.toString().trim();
    const produk = produkAll.data.find(p => (p.id_produk || '').toString().trim() === idStr);
    const namaProduk = produk ? produk.nama_produk : namaAtauId;

    let totalDibeli = 0;
    let totalSampleKeluar = 0;
    if (pembelianAll.success) {
      pembelianAll.data.forEach(r => {
        const id = (r.id_produk || '').toString().trim() || resolveId(r.nama_barang);
        if (id !== idStr) return;
        const qty = parseFloat(r.jumlah) || 0;
        if ((r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample') {
          totalSampleKeluar += qty;
        } else {
          totalDibeli += qty;
        }
      });
    }

    let totalDiproduksi = 0;
    const dipakaiUntukBatches = {}; // consumedInto -> { batchNo -> {bahan, hasil, penyusutan} }
    const bahanBakuUntukIni = {}; // ingredient name -> total qty used to produce THIS item
    if (assemblyAll.success) {
      assemblyAll.data.forEach(r => {
        const skuId = (r.sku || '').toString().trim();
        if (skuId === idStr) {
          totalDiproduksi += parseFloat(r.jumlah_produksi) || 0;
          const bahan = (r.raw_material || '').toString().trim();
          if (bahan) {
            if (!bahanBakuUntukIni[bahan]) bahanBakuUntukIni[bahan] = { jumlah_terpakai: 0, harga_per_unit: parseFloat(r.harga_raw_material) || 0 };
            bahanBakuUntukIni[bahan].jumlah_terpakai += parseFloat(r.jumlah_raw_material) || 0;
          }
        }

        const rawId = resolveId(r.raw_material);
        if (rawId === idStr) {
          const consumedInto = (r.nama_barang || 'tidak diketahui').toString();
          const batchNo = (r.batch_no || '').toString().trim();
          if (!dipakaiUntukBatches[consumedInto]) dipakaiUntukBatches[consumedInto] = {};
          if (!dipakaiUntukBatches[consumedInto][batchNo]) {
            dipakaiUntukBatches[consumedInto][batchNo] = { bahan: 0, hasil: parseFloat(r.jumlah_produksi) || 0, penyusutan: parseFloat(r.penyusutan) || 0 };
          }
          dipakaiUntukBatches[consumedInto][batchNo].bahan += parseFloat(r.jumlah_raw_material) || 0;
        }
      });
    }

    // For each product this material was used to make, show what actually
    // came OUT of those same batches too - not just what went in. That
    // gives the real observed ratio (bahan terpakai / hasil produksi),
    // e.g. ~1.2 for GB->RB (roasting loses ~15-20% weight), directly
    // comparable against the recorded penyusutan instead of guessing.
    const dipakaiUntuk = {};
    Object.keys(dipakaiUntukBatches).forEach(consumedInto => {
      const batchesMap = dipakaiUntukBatches[consumedInto];
      let totalBahan = 0, totalHasil = 0, penyusutanSum = 0, penyusutanCount = 0;
      Object.values(batchesMap).forEach(b => {
        totalBahan += b.bahan;
        totalHasil += b.hasil;
        if (b.penyusutan) { penyusutanSum += b.penyusutan; penyusutanCount++; }
      });
      dipakaiUntuk[consumedInto] = {
        bahan_terpakai: totalBahan,
        hasil_produksi_dari_batch_yg_sama: totalHasil,
        rasio_bahan_per_hasil: totalHasil > 0 ? parseFloat((totalBahan / totalHasil).toFixed(3)) : null,
        rata_rata_penyusutan_tercatat_persen: penyusutanCount > 0 ? parseFloat((penyusutanSum / penyusutanCount).toFixed(2)) : null,
        jumlah_batch: Object.keys(batchesMap).length
      };
    });

    let totalTerjual = 0;
    let totalKemasanTerpakai = 0;
    if (penjualanAll.success) {
      penjualanAll.data.forEach(r => {
        const namaBarang = (r.nama_barang || '').toString().trim();
        if (resolveId(namaBarang) === idStr) totalTerjual += parseFloat(r.jumlah) || 0;
        const kemasanNama = (r.kemasan || '').toString().trim();
        if (kemasanNama && resolveId(kemasanNama) === idStr) totalKemasanTerpakai += parseFloat(r.jumlah_kemasan) || 0;
      });
    }

    const totalDipakaiSebagaiBahan = Object.values(dipakaiUntuk).reduce((s, v) => s + v.bahan_terpakai, 0);
    const totalMasuk = totalDibeli + totalDiproduksi;
    const totalKeluar = totalDipakaiSebagaiBahan + totalTerjual + totalKemasanTerpakai;

    return {
      success: true,
      id_produk: idStr,
      nama_produk: namaProduk,
      total_dibeli_pembelian: totalDibeli,
      total_diproduksi_assembly: totalDiproduksi,
      bahan_baku_yang_dipakai_untuk_membuat_ini: bahanBakuUntukIni,
      total_masuk: totalMasuk,
      dipakai_sebagai_bahan_baku_untuk_produk_lain: dipakaiUntuk,
      total_dipakai_sebagai_bahan_baku: totalDipakaiSebagaiBahan,
      total_terjual_langsung: totalTerjual,
      total_kemasan_terpakai_saat_jual: totalKemasanTerpakai,
      total_sample_keluar_biaya_marketing: totalSampleKeluar,
      total_keluar: totalKeluar,
      sisa: totalMasuk - totalKeluar
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function getStockBreakdown() {
  try {
    const produkAll = getAll('Master_Produk');
    const kemasanAll = getAll('Master_Kemasan');
    const assemblyAll = getAll('Assembly_Entry');
    const penjualanAll = getAll('Penjualan_App');
    const pembelianAll = getAll('Pembelian_App');
    if (!produkAll.success || !assemblyAll.success) return { success: false, message: 'Gagal membaca data' };

    const produkByName = {};
    const produkNameById = {};
    const itemKategori = {};
    produkAll.data.forEach(p => {
      const id = (p.id_produk || '').toString().trim();
      const nama = (p.nama_produk || '').toString().trim();
      if (nama && id) { produkByName[nama.toLowerCase()] = id; produkNameById[id] = nama; itemKategori[id] = p.kategori || ''; }
    });
    if (kemasanAll.success) {
      kemasanAll.data.forEach(k => {
        const nama = (k.nama_kemasan || '').toString().trim();
        if (!nama) return;
        const id = (k.id_kemasan || '').toString().trim() || ('KEM_' + nama.toUpperCase().replace(/\s+/g, '_'));
        if (!produkByName[nama.toLowerCase()]) {
          produkByName[nama.toLowerCase()] = id;
          produkNameById[id] = nama;
          itemKategori[id] = 'Kemasan';
        }
      });
    }
    const resolveId = namaOrId => {
      const s = (namaOrId || '').toString().trim();
      if (!s) return '';
      return produkByName[s.toLowerCase()] || s;
    };

    const batches = {};
    assemblyAll.data.forEach(r => {
      const sku = (r.sku || '').toString().trim();
      const batchNo = (r.batch_no || '').toString().trim();
      const qty = parseFloat(r.jumlah_produksi) || 0;
      if (!sku || !batchNo) return;
      if (!batches[sku]) batches[sku] = {};
      if (!batches[sku][batchNo]) batches[sku][batchNo] = { tanggal: r.tanggal, produced: qty, sold: 0 };
    });

    // RB/HB aren't just sold directly - they're also consumed as raw
    // material by a LATER Assembly step (RB -> Houseblend, RB/HB -> 250g/
    // 500g packages). Assembly doesn't record which SPECIFIC batch of the
    // raw material was used (only its name+qty), so this can't be
    // attributed to one batch the way a Penjualan sale can - aggregated
    // into its own row per product instead, same pattern as unmatched sales.
    const usedInOtherAssembly = {}; // id_produk -> { qty, tanggal (latest) }
    assemblyAll.data.forEach(r => {
      const rawMaterialId = resolveId(r.raw_material);
      const qtyRaw = parseFloat(r.jumlah_raw_material) || 0;
      if (!rawMaterialId || qtyRaw <= 0 || !batches[rawMaterialId]) return; // only relevant for products that have their OWN batches (RB, HB)
      if (!usedInOtherAssembly[rawMaterialId]) usedInOtherAssembly[rawMaterialId] = { qty: 0, tanggal: r.tanggal };
      usedInOtherAssembly[rawMaterialId].qty += qtyRaw;
      if (new Date(r.tanggal) > new Date(usedInOtherAssembly[rawMaterialId].tanggal)) usedInOtherAssembly[rawMaterialId].tanggal = r.tanggal;
    });

    const unmatchedSales = {}; // id_produk -> { qty, tanggal (latest seen) }
    if (penjualanAll.success) {
      penjualanAll.data.forEach(r => {
        const batchNo = (r.batch_no || '').toString().trim();
        const qty = parseFloat(r.jumlah) || 0;
        if (qty <= 0) return;
        const id = resolveId(r.nama_barang);
        let matched = false;
        if (batchNo && batches[id] && batches[id][batchNo]) {
          batches[id][batchNo].sold += qty;
          matched = true;
        }
        if (!matched && id && batches[id]) {
          // This product DOES have Assembly batches, but this specific
          // sale's batch_no is blank or doesn't match any of them (common
          // for older historical rows) - previously silently dropped
          // entirely instead of just being unattributable to one batch,
          // making the sale invisible in the Stock tab even though it
          // really did leave inventory.
          if (!unmatchedSales[id]) unmatchedSales[id] = { qty: 0, tanggal: r.tanggal };
          unmatchedSales[id].qty += qty;
          if (new Date(r.tanggal) > new Date(unmatchedSales[id].tanggal)) unmatchedSales[id].tanggal = r.tanggal;
        }
      });
    }

    const rows = [];
    Object.keys(batches).forEach(sku => {
      Object.keys(batches[sku]).forEach(batchNo => {
        const b = batches[sku][batchNo];
        rows.push({
          id_produk: sku, nama_produk: produkNameById[sku] || sku, kategori: itemKategori[sku] || '', batch_no: batchNo,
          tanggal: b.tanggal, diproduksi: b.produced, terjual: b.sold, dipakai_assembly_lain: 0, sisa: b.produced - b.sold
        });
      });
    });
    Object.keys(unmatchedSales).forEach(id => {
      const u = unmatchedSales[id];
      rows.push({
        id_produk: id, nama_produk: produkNameById[id] || id, kategori: itemKategori[id] || '', batch_no: '(tanpa batch tercatat)',
        tanggal: u.tanggal, diproduksi: 0, terjual: u.qty, dipakai_assembly_lain: 0, sisa: -u.qty
      });
    });
    Object.keys(usedInOtherAssembly).forEach(id => {
      const u = usedInOtherAssembly[id];
      rows.push({
        id_produk: id, nama_produk: produkNameById[id] || id, kategori: itemKategori[id] || '', batch_no: '(dipakai untuk Assembly lain)',
        tanggal: u.tanggal, diproduksi: 0, terjual: 0, dipakai_assembly_lain: u.qty, sisa: -u.qty
      });
    });

    // Items with no Assembly batches at all - purchased raw materials AND
    // kemasan (packaging supplies aren't produced via Assembly, they're
    // bought and then consumed directly at the point of sale).
    const skusWithBatches = new Set(Object.keys(batches));
    const purchasedAgg = {};
    if (pembelianAll.success) {
      pembelianAll.data.forEach(r => {
        const kodeLower = (r.kode_transaksi || '').toString().trim().toLowerCase();
        // Sample entries are purely a financial record (see comment in
        // computeStockLedger) - the matching Penjualan_App row already
        // accounts for the stock reduction, so skip here entirely.
        // Pembayaran Hutang is a debt repayment, not a goods movement.
        if (kodeLower === 'sample' || kodeLower === 'pembayaran hutang') return;
        const id = (r.id_produk || '').toString().trim() || resolveId(r.nama_barang);
        const qty = parseFloat(r.jumlah) || 0;
        if (!id || qty <= 0 || skusWithBatches.has(id)) return;
        if (!purchasedAgg[id]) purchasedAgg[id] = { masuk: 0, keluar: 0 };
        purchasedAgg[id].masuk += qty;
      });
    }
    const saldoAwalStockAll = getAll('Saldo_Awal_Stock');
    if (saldoAwalStockAll.success) {
      saldoAwalStockAll.data.forEach(r => {
        const id = (r.id_produk || '').toString().trim() || resolveId(r.nama_barang);
        const qty = parseFloat(r.qty) || 0;
        if (!id || qty <= 0 || skusWithBatches.has(id)) return;
        if (!purchasedAgg[id]) purchasedAgg[id] = { masuk: 0, keluar: 0 };
        purchasedAgg[id].masuk += qty;
      });
    }
    assemblyAll.data.forEach(r => {
      const rawId = resolveId(r.raw_material);
      const qty = parseFloat(r.jumlah_raw_material) || 0;
      if (rawId && purchasedAgg[rawId]) purchasedAgg[rawId].keluar += qty;
    });
    if (penjualanAll.success) {
      penjualanAll.data.forEach(r => {
        const kemasanNama = (r.kemasan || '').toString().trim();
        const qtyKemasan = parseFloat(r.jumlah_kemasan) || 0;
        if (!kemasanNama || qtyKemasan <= 0) return;
        const kId = resolveId(kemasanNama);
        if (!kId) return;
        if (!purchasedAgg[kId]) purchasedAgg[kId] = { masuk: 0, keluar: 0 };
        purchasedAgg[kId].keluar += qtyKemasan;
      });
    }
    Object.keys(purchasedAgg).forEach(id => {
      rows.push({
        id_produk: id, nama_produk: produkNameById[id] || id, kategori: itemKategori[id] || '', batch_no: '(pembelian, bukan per-batch)',
        tanggal: '', diproduksi: purchasedAgg[id].masuk, terjual: purchasedAgg[id].keluar, dipakai_assembly_lain: 0, sisa: purchasedAgg[id].masuk - purchasedAgg[id].keluar
      });
    });

    // Stock Opname corrections - not attributed to any batch (a physical
    // count discrepancy isn't tied to a specific production run), shown as
    // its own row per product instead.
    const movementAll = getAll('Stock_Movement');
    if (movementAll.success) {
      const opnameAgg = {};
      movementAll.data.forEach(r => {
        const referensi = (r.referensi || '').toString().trim();
        if (!referensi.startsWith('OPN')) return;
        const id = (r.id_produk || '').toString().trim() || resolveId(r.nama_produk);
        if (!id) return;
        if (!opnameAgg[id]) opnameAgg[id] = { masuk: 0, keluar: 0, tanggal: r.tanggal };
        opnameAgg[id].masuk += parseFloat(r.qty_in) || 0;
        opnameAgg[id].keluar += parseFloat(r.qty_out) || 0;
        if (new Date(r.tanggal) > new Date(opnameAgg[id].tanggal)) opnameAgg[id].tanggal = r.tanggal;
      });
      Object.keys(opnameAgg).forEach(id => {
        rows.push({
          id_produk: id, nama_produk: produkNameById[id] || id, kategori: itemKategori[id] || '', batch_no: '(koreksi Stock Opname)',
          tanggal: opnameAgg[id].tanggal, diproduksi: opnameAgg[id].masuk, terjual: opnameAgg[id].keluar, dipakai_assembly_lain: 0, sisa: opnameAgg[id].masuk - opnameAgg[id].keluar
        });
      });
    }

    rows.sort((a, b) => (a.nama_produk || '').localeCompare(b.nama_produk || '') || new Date(a.tanggal || 0) - new Date(b.tanggal || 0));
    return { success: true, data: rows };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function getAllStock() {
  const { ledger, produkNameById, itemKategori } = computeStockLedger();
  const result = Object.keys(ledger).map(id => ({
    id_produk: id,
    nama_produk: produkNameById[id] || id,
    kategori: itemKategori[id] || '',
    masuk: ledger[id].masuk,
    keluar: ledger[id].keluar,
    saldo: ledger[id].masuk - ledger[id].keluar
  })).sort((a, b) => (a.nama_produk || '').localeCompare(b.nama_produk || ''));
  return { success: true, data: result };
}

// ============================================================
// LAPORAN
// ============================================================
// ============================================================
// VIRTUAL GENERAL LEDGER
// ============================================================
// Maps every transaction (Pembelian, Penjualan, Kas Masuk, Assembly) plus
// opening balances into proper double-entry journal lines tied to COA
// codes, WITHOUT touching any existing submission form - the mapping
// happens here, on demand, whenever a report is generated. Every journal
// line has a debit COA, a credit COA, and one amount (applied to both
// sides equally by construction), and generateVirtualGL() reports whether
// total debit = total credit across everything - if a future change to
// this mapping ever breaks that, it shows up as a nonzero "selisih"
// instead of a silently wrong Neraca.
//
// Simplifications, documented rather than hidden:
// - Depreciation, tax provisions, and long-term liability schedules are
//   out of scope - the COA has accounts for them but nothing currently
//   posts to them (no depreciation schedule exists yet).
// - Assembly is treated as a pure inventory-to-inventory transfer (raw
//   material cost + overhead capitalized into the finished good's value),
//   not as manufacturing WIP with separate absorption accounting.
// - Hutang Usaha for NEW purchases (not yet paid) posts to the generic
//   20000-00 account, since Pembelian_App doesn't yet capture which
//   specific vendor a given unpaid purchase is owed to at the sub-account
//   level the way the opening balance (20101-00, PT Ganjar) does.

const COA_KAS = '10100-00';
const COA_BANK_BCA = '10515-00';
const COA_PIUTANG_USAHA = '11000-00';
const COA_PERSEDIAAN_LAINNYA = '12507-00';
const COA_HUTANG_USAHA_GENERIC = '20000-00';
const COA_PENJUALAN = '40010-00';
const COA_HPP = '50100-00';
const COA_FACTORY_OVERHEAD = '50500-00';
const COA_BIAYA_GAJI = '70040-00';
const COA_BIAYA_SAMPLE = '72020-00';
const COA_BIAYA_KONSUMSI_INTERNAL = '79000-00'; // "Bar" cost center - internal consumption, not a real external sale
const COA_PENDAPATAN_LAIN = '80000-00';
const PERSEDIAAN_AKUN_NAME_TO_COA = {
  'persediaan barang mesin kopi': '12501-00',
  'persediaan barang beans': '12502-00',
  'persediaan barang barista tools': '12503-00',
  'persediaan barang grinder': '12504-00',
  'persediaan barang bar': '12505-00',
  'persediaan barang kemasan': '12506-00',
  'persediaan barang lainnya': '12507-00'
};

// Real data uses "Lunas Cash" (not "Lunas Tunai"), and Kas Masuk's
// cash_account uses "Cash in Hand" / "Cash in Bank" (not matching
// Master_COA's "Cash on Hand-IDR" / "Cash in Bank BCA - IDR" exactly).
// Checking bank/transfer FIRST, then hand/tunai/cash, handles every
// wording variant instead of requiring an exact string match. Shared
// globally so generateVirtualGL() and the diagnostic classify identically.
// Reads directly from Penjualan_INV (already one aggregated row per
// invoice, kept in sync by submitPenjualan()/syncPenjualanINV()) instead
// of re-aggregating Penjualan_App's line items on every call - this is
// the single source of truth for "what does this invoice total" used by
// every function that needs one (generateVirtualGL's revenue
// recognition, Piutang reconciliation, Rugi Laba, etc). The
// penjualanData parameter is no longer used (kept so existing call
// sites don't need updating) - anything that specifically needs
// per-PRODUCT/line-item data (COGS, stock movements) still reads
// Penjualan_App directly and must keep doing so, since Penjualan_INV
// only has a comma-joined product list, not individual line items.
function buildPenjualanInvoiceMap_(penjualanData) {
  const invAll = getAll('Penjualan_INV');
  const invoiceMap = {};
  if (!invAll.success) return invoiceMap;
  invAll.data.forEach(r => {
    if ((r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample') return;
    if ((r.customer || '').toString().trim().toLowerCase() === 'bar') return; // internal cost center, not a real receivable
    const inv = (r.no_invoice || '').toString().trim();
    const total = parseFloat(r.total) || 0;
    if (!inv || total <= 0) return;
    invoiceMap[inv] = {
      no_invoice: inv, customer: r.customer, total: total, tanggal: r.tanggal,
      status_bayar: r.status_bayar, type_pembayaran: r.type_pembayaran,
      items: (r.nama_barang || '').toString().split(',').map(s => s.trim()).filter(s => s)
    };
  });
  return invoiceMap;
}

function resolveCashAccount(raw) {
  const lower = (raw || '').toString().trim().toLowerCase();
  if (lower.includes('bank') || lower.includes('transfer')) return COA_BANK_BCA;
  if (lower.includes('hand') || lower.includes('tunai') || lower.includes('cash')) return COA_KAS;
  return null;
}

function resolvePersediaanAccount(namaBarang, produkKategoriMap, stockAwalAkunMap) {
  const namaLower = (namaBarang || '').toString().trim().toLowerCase();
  if (stockAwalAkunMap[namaLower]) return stockAwalAkunMap[namaLower];
  const kategori = (produkKategoriMap[namaLower] || '').toString().toLowerCase();
  if (kategori === 'kemasan') return PERSEDIAAN_AKUN_NAME_TO_COA['persediaan barang kemasan'];
  if (kategori.includes('gb') || kategori.includes('rb') || kategori.includes('hb') || kategori.includes('bean')) return PERSEDIAAN_AKUN_NAME_TO_COA['persediaan barang beans'];
  return COA_PERSEDIAAN_LAINNYA;
}

// Exposes the full GL with human-readable account names resolved (not
// just codes) - what the Buku Besar tab browses, so every transaction's
// COA mapping is directly inspectable instead of inferred from totals.
// Per-customer Piutang and per-vendor Hutang breakdown - the Neraca only
// shows the aggregate "Piutang Usaha"/"Hutang Usaha" total; this traces
// who specifically owes what (or is owed what), built from: opening
// balance (Saldo_Awal) + unpaid Penjualan/Pembelian - payments received/
// made that aren't tied to a specific invoice (invoice-linked payments
// are already reflected via that invoice's own status_bayar).
function generatePiutangHutangDetail() {
  try {
    const saldoAwalAll = getAll('Saldo_Awal');
    const penjualanAll = getAll('Penjualan_App');
    const kasMasukAll = getAll('Kas_Masuk');
    const pembelianAll = getAll('Pembelian_App');

    // Party matching: "Hutang Kepada PT Ganjar" (opening balance account
    // name) vs "PT Ganjar" (Pembelian's actual supplier name) need to
    // merge into the same vendor - handled by stripping the "Hutang
    // Kepada " prefix, then matching EXACTLY (case-insensitive).
    //
    // An earlier version of this also merged names when one merely
    // CONTAINED the other (e.g. "Ganjar" inside "PT Ganjar"), meant to
    // catch cases like "Bayar Hutang Ganjar" - but with many customers
    // sharing a common word (e.g. a dozen different "Arif (Location)"
    // businesses), that silently merged UNRELATED customers together
    // whenever a shorter name was a substring of a longer one (a generic
    // "Arif" row would attach itself to whichever "Arif (...)" customer
    // happened to be processed first). Exact matching is safe; a rare
    // literal-wording mismatch like "Bayar Hutang Ganjar" is a far smaller
    // problem than cross-contaminating real customer balances.
    const stripPrefix = s => (s || '').toString().replace(/^Hutang Kepada\s+/i, '').trim();
    const makeKeyResolver = () => {
      const knownKeys = {};
      return raw => {
        const norm = stripPrefix(raw);
        if (!norm) return '(Tidak diketahui)';
        const normLower = norm.toLowerCase();
        if (knownKeys[normLower] !== undefined) return knownKeys[normLower];
        knownKeys[normLower] = norm;
        return norm;
      };
    };

    // --- PIUTANG ---
    // total_tagihan is the FULL invoice total repeated on every line-item
    // row (an invoice can have several products), so grouping by
    // no_invoice FIRST and taking one total per invoice avoids counting
    // the same invoice multiple times.
    const piutangKeyOf = makeKeyResolver();
    const piutangByCustomer = {};
    const touchPiutang = (nama, delta, keterangan) => {
      const key = piutangKeyOf(nama);
      if (!piutangByCustomer[key]) piutangByCustomer[key] = { nama: key, saldo: 0, detail: [] };
      piutangByCustomer[key].saldo += delta;
      piutangByCustomer[key].detail.push({ jumlah: parseFloat(delta.toFixed(2)), keterangan: keterangan });
    };
    if (saldoAwalAll.success) {
      saldoAwalAll.data.forEach(r => {
        if (r.kategori !== 'Piutang') return;
        const saldo = parseFloat(r.saldo_awal) || 0;
        if (!saldo) return;
        touchPiutang(r.nama_akun, saldo, 'Saldo awal (1 Jan 2026)');
      });
    }
    const invoiceMap = buildPenjualanInvoiceMap_(penjualanAll.success ? penjualanAll.data : []);
    // Charges are shown/excluded purely by status_bayar (an invoice paid
    // at time of sale never became a receivable). Payments are ALWAYS
    // shown as a visible reduction - EXCEPT the exact no_invoice_ref
    // payment that officially marked an invoice lunas, since that pair is
    // already resolved by excluding the charge above and showing the
    // payment too would double it as a phantom negative.
    if (kasMasukAll.success) {
      kasMasukAll.data.forEach(r => {
        const kode = (r.kode_transaksi || '').toString().trim().toLowerCase();
        const refInvoiceField = (r.no_invoice_ref || '').toString().trim();
        const noDokumen = (r.no_dokumen || '').toString().trim();
        // Falls back to no_dokumen when no_invoice_ref is blank but
        // no_dokumen happens to exactly equal a real invoice number - a
        // common data-entry pattern (invoice number typed into the wrong
        // field). Exact match on a structured field, not a text search.
        const refInvoice = refInvoiceField || (invoiceMap[noDokumen] ? noDokumen : '');
        const hasValidInvoiceRef = refInvoice && !!invoiceMap[refInvoice];
        // Strict rule: a valid invoice reference always means Piutang,
        // regardless of kode_transaksi - a data-entry mistake there
        // shouldn't cause a real invoice payment to be skipped.
        if (!hasValidInvoiceRef && !kode.includes('piutang')) return;
        const jumlah = parseFloat(r.kas_masuk) || 0;
        if (jumlah <= 0) return;

        if (refInvoice && invoiceMap[refInvoice]) {
          const refStatus = (invoiceMap[refInvoice].status_bayar || '').toString().trim().toLowerCase();
          if (refStatus === 'lunas') return; // this IS the payment that closed that invoice - already reflected by excluding its charge
        }
        const label = refInvoice
          ? ('Pembayaran invoice ' + refInvoice + ': ' + (r.no_dokumen || ''))
          : ('Pembayaran (saldo umum/tidak terikat invoice): ' + (r.no_dokumen || ''));
        touchPiutang(r.lawan_transaksi, -jumlah, label);
      });
    }
    Object.keys(invoiceMap).forEach(inv => {
      const info = invoiceMap[inv];
      const statusLower = (info.status_bayar || '').toString().trim().toLowerCase();
      if (statusLower === 'lunas') return;
      touchPiutang(info.customer, info.total, 'Penjualan belum lunas: ' + inv + ' - ' + info.items.join(', '));
    });
    const piutangList = Object.values(piutangByCustomer)
      .map(c => ({ nama: c.nama, saldo: parseFloat(c.saldo.toFixed(2)), detail: c.detail }))
      .filter(c => Math.abs(c.saldo) > 0.5)
      .sort((a, b) => b.saldo - a.saldo);
    const totalPiutang = piutangList.reduce((s, c) => s + c.saldo, 0);

    // --- HUTANG ---
    // Same dedupe safety: group Pembelian by no_dokumen first, in case a
    // single purchase document also spans multiple line-item rows.
    const hutangKeyOf = makeKeyResolver();
    const hutangByVendor = {};
    const touchHutang = (nama, delta, keterangan) => {
      const key = hutangKeyOf(nama);
      if (!hutangByVendor[key]) hutangByVendor[key] = { nama: key, saldo: 0, detail: [] };
      hutangByVendor[key].saldo += delta;
      hutangByVendor[key].detail.push({ jumlah: parseFloat(delta.toFixed(2)), keterangan: keterangan });
    };
    if (saldoAwalAll.success) {
      saldoAwalAll.data.forEach(r => {
        if (r.kategori !== 'Hutang') return;
        const saldo = parseFloat(r.saldo_awal) || 0;
        if (!saldo) return;
        touchHutang(r.nama_akun, saldo, 'Saldo awal (1 Jan 2026)');
      });
    }
    if (pembelianAll.success) {
      const dokumenMap = {}; // no_dokumen -> { supplier, total, statusBayar, items: [] }
      const pembayaranHutangRows = [];
      pembelianAll.data.forEach(r => {
        const kode = (r.kode_transaksi || '').toString().trim();
        const total = parseFloat(r.total) || 0;
        if (total <= 0) return;
        if (kode === 'Pembelian') {
          const dok = (r.no_dokumen || '').toString().trim();
          if (!dok) return;
          if (!dokumenMap[dok]) dokumenMap[dok] = { supplier: r.nama_supplier, total: total, statusBayar: r.status_bayar, items: [] };
          dokumenMap[dok].items.push(r.nama_barang);
        } else if (kode === 'Pembayaran Hutang') {
          pembayaranHutangRows.push(r);
        }
      });
      Object.keys(dokumenMap).forEach(dok => {
        const info = dokumenMap[dok];
        const statusLower = (info.statusBayar || '').toString().trim().toLowerCase();
        if (statusLower.startsWith('lunas')) return;
        touchHutang(info.supplier, info.total, 'Pembelian belum lunas: ' + dok + ' - ' + info.items.join(', '));
      });
      pembayaranHutangRows.forEach(r => {
        const total = parseFloat(r.total) || 0;
        touchHutang(r.nama_supplier, -total, 'Pembayaran hutang: ' + (r.no_dokumen || ''));
      });
    }
    const hutangList = Object.values(hutangByVendor)
      .map(v => ({ nama: v.nama, saldo: parseFloat(v.saldo.toFixed(2)), detail: v.detail }))
      .filter(v => Math.abs(v.saldo) > 0.5)
      .sort((a, b) => b.saldo - a.saldo);
    const totalHutang = hutangList.reduce((s, v) => s + v.saldo, 0);

    return {
      success: true,
      piutang: piutangList, total_piutang: parseFloat(totalPiutang.toFixed(2)),
      hutang: hutangList, total_hutang: parseFloat(totalHutang.toFixed(2))
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function getBukuBesar(forceRefresh) {
  return withCache_('buku_besar_all', 600, () => {
    try {
      const glResult = generateVirtualGL(null);
      if (!glResult.success) return glResult;
      const coaAll = getAll('Master_COA');
      const coaByCode = {};
      if (coaAll.success) coaAll.data.forEach(c => { if (c.coa) coaByCode[c.coa.toString().trim()] = c; });
      const nameFor = coa => {
        const rec = coaByCode[coa];
        return rec ? (coa + ' - ' + rec.nama_akun) : (coa + ' (tidak dikenali)');
      };
      const entries = glResult.entries.map(e => ({
        tanggal: e.tanggal,
        akun_debit: nameFor(e.coa_debit),
        akun_kredit: nameFor(e.coa_kredit),
        jumlah: e.jumlah,
        keterangan: e.keterangan,
        pihak: e.pihak || '',
        sumber: e.sumber,
        referensi: e.referensi
      })).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      return { success: true, data: entries };
    } catch (e) {
      return { success: false, message: e.toString() };
    }
  }, forceRefresh);
}

function generateVirtualGL(periode) {
  try {
    const entries = [];
    const add = (tanggal, coaDebit, coaKredit, jumlah, keterangan, referensi, sumber, pihak) => {
      const amt = parseFloat(jumlah);
      if (!amt || amt <= 0) return;
      entries.push({ tanggal: formatTanggalCell(tanggal), coa_debit: coaDebit, coa_kredit: coaKredit, jumlah: parseFloat(amt.toFixed(2)), keterangan: keterangan, referensi: referensi || '', sumber: sumber, pihak: pihak || '' });
    };
    const inPeriode = tanggal => !periode || formatTanggalCell(tanggal).startsWith(periode);

    // Fetch every source ONCE up front - the previous version called
    // getHPP() (itself several getAll() calls) and getAll('Master_Kemasan')
    // INSIDE the ~380-row Penjualan loop, meaning thousands of redundant
    // full-sheet reads per run. Everything needed is precomputed into
    // lookup maps below instead.
    const produkAll = getAll('Master_Produk');
    const assemblyAll = getAll('Assembly_Entry');
    const stockAwalAll = getAll('Saldo_Awal_Stock');
    const pembelianAll = getAll('Pembelian_App');
    const penjualanAll = getAll('Penjualan_App');
    const kasMasukAll = getAll('Kas_Masuk');
    const kemasanAll = getAll('Master_Kemasan');
    const hppCalcAll = getAll('HPP_Calculation');

    const produkKategoriMap = {};
    const produkIdByName = {};
    if (produkAll.success) {
      produkAll.data.forEach(p => {
        if (!p.nama_produk) return;
        const nama = p.nama_produk.toString().trim().toLowerCase();
        produkKategoriMap[nama] = p.kategori;
        produkIdByName[nama] = p.id_produk;
      });
    }
    const stockAwalAkunMap = {};
    if (stockAwalAll.success) {
      stockAwalAll.data.forEach(r => {
        const akunName = (r.akun || '').toString().trim().toLowerCase();
        const coaCode = PERSEDIAAN_AKUN_NAME_TO_COA[akunName];
        if (r.nama_barang && coaCode) stockAwalAkunMap[r.nama_barang.toString().trim().toLowerCase()] = coaCode;
      });
    }
    const persediaan = nama => resolvePersediaanAccount(nama, produkKategoriMap, stockAwalAkunMap);

    // HPP per product, precomputed once (mirrors getHPP()'s own fallback:
    // HPP_Calculation first, then the latest Assembly_Entry batch).
    const hppByProduk = {};
    if (hppCalcAll.success) {
      hppCalcAll.data.forEach(r => {
        const id = (r.id_produk || '').toString().trim();
        const hpp = parseFloat(r.hpp_per_unit) || 0;
        if (!id || hpp <= 0) return;
        const existing = hppByProduk[id];
        if (!existing || new Date(r.created_at) > new Date(existing.at)) hppByProduk[id] = { hpp: hpp, at: r.created_at };
      });
    }
    if (assemblyAll.success) {
      assemblyAll.data.forEach(r => {
        const id = (r.sku || '').toString().trim();
        const hpp = parseFloat(r.hpp) || 0;
        if (!id || hpp <= 0 || hppByProduk[id]) return; // HPP_Calculation takes priority when present
        const existing = hppByProduk[id];
        if (!existing || new Date(r.tanggal) > new Date(existing.at)) hppByProduk[id] = { hpp: hpp, at: r.tanggal };
      });
    }
    const hppLookup = id => (hppByProduk[id] ? hppByProduk[id].hpp : 0);

    // Material-only cost per unit (no overhead), from the latest Assembly
    // batch per product - used for the GL's COGS entry specifically, so it
    // stays consistent with the Assembly journal entry above (which only
    // ever adds MATERIAL cost to inventory, not overhead). Using the
    // overhead-inclusive hppLookup here instead would credit more value
    // out of Persediaan on each sale than was ever debited in via
    // Assembly, silently understating inventory over time.
    const materialHppByProduk = {};
    if (assemblyAll.success) {
      assemblyAll.data.forEach(r => {
        const id = (r.sku || '').toString().trim();
        const qty = parseFloat(r.jumlah_produksi) || 0;
        const materialTotal = parseFloat(r.total_harga_material) || 0;
        if (!id || qty <= 0 || materialTotal <= 0) return;
        const unitCost = materialTotal / qty;
        const existing = materialHppByProduk[id];
        if (!existing || new Date(r.tanggal) > new Date(existing.at)) materialHppByProduk[id] = { hpp: unitCost, at: r.tanggal };
      });
    }
    const materialHppLookup = id => (materialHppByProduk[id] ? materialHppByProduk[id].hpp : 0);

    const kemasanHargaByName = {};
    if (kemasanAll.success) {
      kemasanAll.data.forEach(k => { if (k.nama_kemasan) kemasanHargaByName[k.nama_kemasan.toString().trim().toLowerCase()] = parseFloat(k.harga) || 0; });
    }
    // Pembelian's COA field stores the account NAME the user picked from
    // the dropdown (e.g. "Gaji", "Electricity"), not its code - resolved
    // here against Master_COA so that choice is actually respected instead
    // of guessing/hardcoding one account for every "Pembelian Biaya" row.
    const coaAllForLookup = getAll('Master_COA');
    const coaCodeByName = {};
    if (coaAllForLookup.success) {
      coaAllForLookup.data.forEach(c => { if (c.nama_akun) coaCodeByName[c.nama_akun.toString().trim().toLowerCase()] = c.coa; });
    }
    const resolveCoaField = (namaAkun, fallback) => coaCodeByName[(namaAkun || '').toString().trim().toLowerCase()] || fallback;

    // --- Pembelian ---
    if (pembelianAll.success) {
      pembelianAll.data.forEach(r => {
        if (!inPeriode(r.tanggal)) return;
        const total = parseFloat(r.total) || 0;
        if (total <= 0) return;
        const kode = (r.kode_transaksi || '').toString().trim();
        // Real status_bayar values are "Lunas Transfer" / "Lunas Tunai" /
        // "Hutang" - not a plain "Lunas" - so an exact-match check here was
        // silently failing for every paid purchase, wrongly treating them
        // all as unpaid debt and massively inflating Hutang Usaha.
        const statusLower = (r.status_bayar || '').toString().trim().toLowerCase();
        const lunas = statusLower.startsWith('lunas');
        const kasKreditAccount = !lunas ? COA_HUTANG_USAHA_GENERIC : (resolveCashAccount(r.status_bayar) || COA_BANK_BCA);

        if (kode === 'Pembelian') {
          // Respect the user's own COA choice if they made one; otherwise
          // fall back to the kategori-based inventory account guess.
          const debitAccount = resolveCoaField(r.coa, persediaan(r.nama_barang));
          add(r.tanggal, debitAccount, kasKreditAccount, total, 'Pembelian: ' + r.nama_barang, r.no_dokumen, 'Pembelian_App', r.nama_supplier);
        } else if (kode === 'Pembelian Biaya') {
          const debitAccount = resolveCoaField(r.coa, COA_BIAYA_GAJI);
          add(r.tanggal, debitAccount, kasKreditAccount, total, 'Biaya: ' + r.nama_barang, r.no_dokumen, 'Pembelian_App', r.nama_supplier);
        } else if (kode === 'Sample') {
          // Debit the marketing expense, credit inventory - the matching
          // Penjualan_App row (kept for stock/audit trail) is what already
          // reduced the physical stock; this is the expense side only.
          add(r.tanggal, COA_BIAYA_SAMPLE, persediaan(r.nama_barang), total, 'Sample: ' + r.nama_barang, r.no_dokumen, 'Pembelian_App', r.nama_supplier);
        } else if (kode === 'Pembayaran Hutang') {
          // A standalone debt paydown - not a new purchase, no inventory
          // change. Debits the specific vendor's Hutang account if the
          // user picked one (e.g. "Hutang Kepada PT Ganjar"), otherwise the
          // generic control account; credits whichever cash account was
          // actually used to pay.
          const debitAccount = resolveCoaField(r.coa, COA_HUTANG_USAHA_GENERIC);
          const creditAccount = lunas ? kasKreditAccount : COA_BANK_BCA;
          add(r.tanggal, debitAccount, creditAccount, total, 'Pembayaran Hutang: ' + r.nama_barang, r.no_dokumen, 'Pembelian_App', r.nama_supplier);
        }
      });
    }

    // --- Penjualan (revenue + COGS) ---
    if (penjualanAll.success) {
      // Revenue: total_tagihan is the FULL invoice total, repeated on
      // every line-item row of a multi-product invoice - creating a
      // journal entry per ROW would recognize the same invoice's revenue
      // (and debit Piutang/Kas for it) once per product instead of once
      // per invoice. Grouping by no_invoice and posting only the first
      // time each invoice is seen fixes this.
      //
      // Every sale is recognized in TWO steps, never one combined entry:
      // (1) the sale itself always debits Piutang Usaha and credits
      // Penjualan - Kas/Bank is NEVER paired directly with Penjualan.
      // (2) if paid at time of sale, a SEPARATE entry debits Kas/Bank and
      // credits Piutang Usaha, clearing it immediately. This keeps the
      // sale and its payment as two independently visible, auditable
      // events in the Buku Besar - a "lunas" sale still nets Piutang to 0
      // for that invoice, but both sides of how it got there stay visible,
      // exactly like a later Kas Masuk payment would.
      const invoiceMap = buildPenjualanInvoiceMap_(penjualanAll.data);
      Object.values(invoiceMap).forEach(inv => {
        if (!inPeriode(inv.tanggal)) return;

        // Step 1: the sale always creates a receivable first.
        add(inv.tanggal, COA_PIUTANG_USAHA, COA_PENJUALAN, inv.total, 'Penjualan: ' + inv.no_invoice, inv.no_invoice, 'Penjualan_App', inv.customer);

        // Step 2: only if paid at time of sale - a genuinely separate
        // payment event, not a substitute for step 1.
        const lunas = (inv.status_bayar || '').toString().trim().toLowerCase() === 'lunas';
        if (lunas) {
          // type_pembayaran ("Lunas Transfer" / "Lunas Cash") says which
          // cash account actually received the money.
          const kasDebitAccount = resolveCashAccount(inv.type_pembayaran) || COA_BANK_BCA;
          add(inv.tanggal, kasDebitAccount, COA_PIUTANG_USAHA, inv.total, 'Pembayaran (lunas saat penjualan): ' + inv.no_invoice, inv.no_invoice, 'Kas_Masuk', inv.customer);
        }
      });

      // COGS: legitimately per line-item, since each product on the
      // invoice has its own HPP x quantity - unlike revenue, this is NOT
      // a repeated total, so every row needs its own entry.
      penjualanAll.data.forEach(r => {
        if (!inPeriode(r.tanggal)) return;
        if ((r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample') return;
        // "Bar" internal consumption still costs real inventory, but
        // categorized as an operating expense instead of wholesale COGS -
        // otherwise it drags down Laba Kotor on genuine customer sales
        // even though no real revenue was ever expected for it.
        const cogsAccount = isInternalCostCenter(r) ? COA_BIAYA_KONSUMSI_INTERNAL : COA_HPP;
        const cogsLabel = isInternalCostCenter(r) ? 'Konsumsi internal (Bar): ' : 'HPP: ';
        // material-only cost (matching what the Assembly entry above
        // actually added to inventory), not the overhead-inclusive HPP -
        // falls back to full HPP if there's no Assembly batch history at
        // all for this product (e.g. sold straight from opening stock).
        const namaBarang = (r.nama_barang || '').toString().trim();
        const jumlah = parseFloat(r.jumlah) || 0;
        if (namaBarang && jumlah > 0) {
          const idProduk = produkIdByName[namaBarang.toLowerCase()] || '';
          const materialHpp = idProduk ? materialHppLookup(idProduk) : 0;
          const cogsUnitCost = materialHpp > 0 ? materialHpp : (idProduk ? hppLookup(idProduk) : 0);
          if (cogsUnitCost > 0) add(r.tanggal, cogsAccount, persediaan(namaBarang), cogsUnitCost * jumlah, cogsLabel + namaBarang, r.no_invoice, 'Penjualan_App', r.customer);
        }
        // Kemasan consumed for this sale.
        const kemasanNama = (r.kemasan || '').toString().trim();
        const jumlahKemasan = parseFloat(r.jumlah_kemasan) || 0;
        if (kemasanNama && jumlahKemasan > 0) {
          const hargaKemasan = kemasanHargaByName[kemasanNama.toLowerCase()] || 0;
          if (hargaKemasan > 0) add(r.tanggal, cogsAccount, persediaan(kemasanNama), hargaKemasan * jumlahKemasan, (isInternalCostCenter(r) ? 'Konsumsi internal (Bar) - Kemasan: ' : 'Kemasan: ') + kemasanNama, r.no_invoice, 'Penjualan_App', r.customer);
        }
      });
    }

    // --- Kas Masuk ---
    if (kasMasukAll.success) {
      // Strict rule: if a Kas Masuk row has a no_invoice_ref matching a
      // real Penjualan invoice, its pair MUST be Piutang Usaha - full
      // stop, regardless of what kode_transaksi says. A data-entry
      // mistake in kode_transaksi (e.g. wrongly marked "Pendapatan Lain"
      // despite carrying a valid invoice reference) is corrected here
      // instead of silently misclassifying real invoice payments.
      const validInvoiceNumbers = new Set();
      if (penjualanAll.success) penjualanAll.data.forEach(r => { const inv = (r.no_invoice || '').toString().trim(); if (inv) validInvoiceNumbers.add(inv); });

      kasMasukAll.data.forEach(r => {
        if (!inPeriode(r.tanggal)) return;
        const jumlah = parseFloat(r.kas_masuk) || 0;
        if (jumlah <= 0) return;
        const kode = (r.kode_transaksi || '').toString().trim().toLowerCase();
        // Resolve the actual cash account used (Kas vs Bank) instead of
        // always assuming Bank - same gap found in Pembelian/Penjualan.
        const kasDebitAccount = resolveCashAccount(r.cash_account) || COA_BANK_BCA;
        const refInvoiceField = (r.no_invoice_ref || '').toString().trim();
        const noDokumen = (r.no_dokumen || '').toString().trim();
        // Falls back to no_dokumen when no_invoice_ref is blank but
        // no_dokumen happens to exactly equal a real invoice number - a
        // common data-entry pattern (the invoice number typed into the
        // wrong field). An EXACT match on a structured field, unlike the
        // free-text search removed earlier for being too fragile.
        const refInvoice = refInvoiceField || (validInvoiceNumbers.has(noDokumen) ? noDokumen : '');
        const hasValidInvoiceRef = refInvoice && validInvoiceNumbers.has(refInvoice);

        if (hasValidInvoiceRef || kode.includes('piutang')) {
          add(r.tanggal, kasDebitAccount, COA_PIUTANG_USAHA, jumlah, 'Pembayaran piutang: ' + (r.lawan_transaksi || ''), refInvoice || r.no_dokumen, 'Kas_Masuk', r.lawan_transaksi);
        } else if (kode.includes('modal')) {
          const coaModal = (r.lawan_transaksi || '').toString().split(' - ')[0].trim();
          add(r.tanggal, kasDebitAccount, coaModal || '30000-00', jumlah, 'Setoran modal: ' + (r.lawan_transaksi || ''), r.no_dokumen, 'Kas_Masuk', r.lawan_transaksi);
        } else {
          add(r.tanggal, kasDebitAccount, COA_PENDAPATAN_LAIN, jumlah, 'Pendapatan lain: ' + (r.lawan_transaksi || ''), r.no_dokumen, 'Kas_Masuk', r.lawan_transaksi);
        }
      });
    }

    // --- Assembly: inventory transfer (material + overhead capitalized
    // into the finished good), grouped by batch so overhead is counted
    // once per batch, not once per raw material row.
    //
    // NOTE: only the material-cost transfer is journaled here. Assembly's
    // overhead_amount (still used exactly as before for HPP/Pricelist
    // purposes) is deliberately NOT posted to the GL - crediting a
    // "Factory Overhead" account for absorption with no corresponding
    // debit anywhere (no actual electricity/rent/etc. expense is tracked
    // as a distinct transaction yet) would inflate reported profit by
    // that amount without any real cost behind it. Once actual overhead
    // expenses are tracked as their own transactions, this can be
    // reinstated properly (debit when incurred, credit when absorbed).
    if (assemblyAll.success) {
      assemblyAll.data.forEach(r => {
        if (!inPeriode(r.tanggal)) return;
        const jumlahRaw = parseFloat(r.jumlah_raw_material) || 0;
        const hargaRaw = parseFloat(r.harga_raw_material) || 0;
        const materialCost = jumlahRaw * hargaRaw;
        if (materialCost > 0) {
          add(r.tanggal, persediaan(r.nama_barang), persediaan(r.raw_material), materialCost, 'Assembly ' + r.batch_no + ': ' + r.raw_material + ' -> ' + r.nama_barang, r.batch_no, 'Assembly_Entry');
        }
      });
    }

    const debitByAccount = {}, kreditByAccount = {};
    entries.forEach(e => {
      debitByAccount[e.coa_debit] = (debitByAccount[e.coa_debit] || 0) + e.jumlah;
      kreditByAccount[e.coa_kredit] = (kreditByAccount[e.coa_kredit] || 0) + e.jumlah;
    });

    return {
      success: true,
      total_entries: entries.length,
      // NOTE: debit_per_akun and kredit_per_akun always sum to the same
      // total by construction (every entry applies one amount to both a
      // debit and a credit account) - that's NOT proof the resulting
      // Neraca balances, only that these entries are internally
      // consistent. Use verifyNeracaBalance() for the real check
      // (Assets = Liabilities + Equity), which can actually fail if the
      // account mapping above has a mistake.
      debit_per_akun: debitByAccount,
      kredit_per_akun: kreditByAccount,
      entries: entries
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// The REAL audit check: aggregates opening balances + everything
// generateVirtualGL() produced into a balance per COA account, groups by
// Kategori 1 (Aktiva/Kewajiban/Modal/Pendapatan/HPP/Biaya), and verifies
// Assets = Liabilities + Equity + Net Income (Pendapatan - HPP - Biaya).
// Unlike the internal debit=credit tally in generateVirtualGL(), THIS can
// genuinely fail if the account mapping has an error - e.g. a transaction
// posted to the wrong side, or a source table getting double-counted.
// Computes account balances (debit-positive) as of a cutoff date. Opening
// balances always apply (they're as of Jan 1); GL entries dated on or
// before asOfDate are added on top. asOfDate=null means "all activity to
// date" (today). This is the shared engine behind verifyNeracaBalance(),
// generateNeracaReport(), and generateRugiLabaReportDetailed() - one place
// that knows how to turn opening balances + GL entries into a balance per
// COA account, so all three reports stay consistent with each other.
// Precomputes everything that's identical across every report column (COA
// lookup, opening balances, the full GL entry list) exactly once. Building
// generateNeracaReport()/generateRugiLabaReportDetailed() on top of this
// instead of calling computeAccountBalances()/computeFlowBalances() once
// per column (Total + 7 months = 8x) is the real fix for the slow load
// time - each of those calls re-ran the entire GL computation (multiple
// sheet reads plus HPP lookups) from scratch, so the report was doing 8x
// more work than necessary. A cache alone wouldn't have fixed a cold load.
function buildReportContext() {
  try {
    const coaAll = getAll('Master_COA');
    if (!coaAll.success) return coaAll;
    const coaByCode = {};
    coaAll.data.forEach(c => { if (c.coa) coaByCode[c.coa.toString().trim()] = c; });
    const coaByName = {};
    coaAll.data.forEach(c => { if (c.nama_akun) coaByName[c.nama_akun.toString().trim().toLowerCase()] = c.coa; });

    const openingBalances = {};
    const touchOpening = (coa, delta) => { openingBalances[coa] = (openingBalances[coa] || 0) + delta; };
    const saldoAwalAll = getAll('Saldo_Awal');
    if (saldoAwalAll.success) {
      saldoAwalAll.data.forEach(r => {
        const saldo = parseFloat(r.saldo_awal) || 0;
        if (!saldo) return;
        let coa = (r.coa || '').toString().trim();
        if (!coa) coa = coaByName[(r.nama_akun || '').toString().trim().toLowerCase()] || '';
        if (!coa) {
          if (r.kategori === 'Hutang') coa = COA_HUTANG_USAHA_GENERIC;
          else if (r.kategori === 'Piutang') coa = COA_PIUTANG_USAHA;
          else return;
        }
        touchOpening(coa, saldo);
      });
    }
    const saldoAwalStockAll = getAll('Saldo_Awal_Stock');
    if (saldoAwalStockAll.success) {
      const produkAll = getAll('Master_Produk');
      const produkKategoriMap = {};
      if (produkAll.success) produkAll.data.forEach(p => { if (p.nama_produk) produkKategoriMap[p.nama_produk.toString().trim().toLowerCase()] = p.kategori; });
      const stockAwalAkunMap = {};
      saldoAwalStockAll.data.forEach(r => {
        const akunName = (r.akun || '').toString().trim().toLowerCase();
        const coaCode = PERSEDIAAN_AKUN_NAME_TO_COA[akunName];
        if (r.nama_barang && coaCode) stockAwalAkunMap[r.nama_barang.toString().trim().toLowerCase()] = coaCode;
      });
      saldoAwalStockAll.data.forEach(r => {
        const totalCost = parseFloat(r.total_cost) || 0;
        if (!totalCost) return;
        const coa = resolvePersediaanAccount(r.nama_barang, produkKategoriMap, stockAwalAkunMap);
        touchOpening(coa, totalCost);
      });
    }

    const glResult = generateVirtualGL(null);
    if (!glResult.success) return glResult;

    const isDebitNormal = coa => {
      const rec = coaByCode[coa];
      const kat1 = rec ? (rec.kategori_1 || '').toString() : '';
      return kat1.startsWith('1.') || kat1.startsWith('2.') || kat1.startsWith('6.') || kat1.startsWith('7.') || kat1.startsWith('8.') || kat1.startsWith('9.');
    };

    return { success: true, coaByCode: coaByCode, openingBalances: openingBalances, entries: glResult.entries, isDebitNormal: isDebitNormal };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Cumulative balance as of a cutoff date (Neraca) - cheap in-memory filter
// over the context's precomputed entries, no sheet I/O.
function accountBalancesFromContext(ctx, asOfDate) {
  const balances = Object.assign({}, ctx.openingBalances);
  const touch = (coa, delta) => { balances[coa] = (balances[coa] || 0) + delta; };
  const cutoff = asOfDate ? new Date(asOfDate) : null;
  ctx.entries.forEach(e => {
    if (cutoff && new Date(e.tanggal) > cutoff) return;
    touch(e.coa_debit, ctx.isDebitNormal(e.coa_debit) ? e.jumlah : -e.jumlah);
    touch(e.coa_kredit, ctx.isDebitNormal(e.coa_kredit) ? -e.jumlah : e.jumlah);
  });
  return balances;
}

// Flow activity within one month (or all months if monthStr is null) -
// Rugi Laba, no opening balances since it's a flow, not a cumulative
// balance.
function flowBalancesFromContext(ctx, monthStr) {
  const balances = {};
  const touch = (coa, delta) => { balances[coa] = (balances[coa] || 0) + delta; };
  ctx.entries.forEach(e => {
    if (monthStr && !e.tanggal.startsWith(monthStr)) return;
    touch(e.coa_debit, ctx.isDebitNormal(e.coa_debit) ? e.jumlah : -e.jumlah);
    touch(e.coa_kredit, ctx.isDebitNormal(e.coa_kredit) ? -e.jumlah : e.jumlah);
  });
  return balances;
}

function computeAccountBalances(asOfDate) {
  try {
    const coaAll = getAll('Master_COA');
    if (!coaAll.success) return coaAll;
    const coaByCode = {};
    coaAll.data.forEach(c => { if (c.coa) coaByCode[c.coa.toString().trim()] = c; });
    const coaByName = {};
    coaAll.data.forEach(c => { if (c.nama_akun) coaByName[c.nama_akun.toString().trim().toLowerCase()] = c.coa; });

    const balances = {};
    const touch = (coa, delta) => { balances[coa] = (balances[coa] || 0) + delta; };

    const saldoAwalAll = getAll('Saldo_Awal');
    if (saldoAwalAll.success) {
      saldoAwalAll.data.forEach(r => {
        const saldo = parseFloat(r.saldo_awal) || 0;
        if (!saldo) return;
        let coa = (r.coa || '').toString().trim();
        if (!coa) coa = coaByName[(r.nama_akun || '').toString().trim().toLowerCase()] || '';
        if (!coa) {
          if (r.kategori === 'Hutang') coa = COA_HUTANG_USAHA_GENERIC;
          else if (r.kategori === 'Piutang') coa = COA_PIUTANG_USAHA;
          else return;
        }
        touch(coa, saldo);
      });
    }
    const saldoAwalStockAll = getAll('Saldo_Awal_Stock');
    if (saldoAwalStockAll.success) {
      const produkAll = getAll('Master_Produk');
      const produkKategoriMap = {};
      if (produkAll.success) produkAll.data.forEach(p => { if (p.nama_produk) produkKategoriMap[p.nama_produk.toString().trim().toLowerCase()] = p.kategori; });
      const stockAwalAkunMap = {};
      saldoAwalStockAll.data.forEach(r => {
        const akunName = (r.akun || '').toString().trim().toLowerCase();
        const coaCode = PERSEDIAAN_AKUN_NAME_TO_COA[akunName];
        if (r.nama_barang && coaCode) stockAwalAkunMap[r.nama_barang.toString().trim().toLowerCase()] = coaCode;
      });
      saldoAwalStockAll.data.forEach(r => {
        const totalCost = parseFloat(r.total_cost) || 0;
        if (!totalCost) return;
        const coa = resolvePersediaanAccount(r.nama_barang, produkKategoriMap, stockAwalAkunMap);
        touch(coa, totalCost);
      });
    }

    const isDebitNormal = coa => {
      const rec = coaByCode[coa];
      const kat1 = rec ? (rec.kategori_1 || '').toString() : '';
      return kat1.startsWith('1.') || kat1.startsWith('2.') || kat1.startsWith('6.') || kat1.startsWith('7.') || kat1.startsWith('8.') || kat1.startsWith('9.');
    };
    const glAll = generateVirtualGL(null);
    if (!glAll.success) return glAll;
    const cutoff = asOfDate ? new Date(asOfDate) : null;
    glAll.entries.forEach(e => {
      if (cutoff && new Date(e.tanggal) > cutoff) return;
      touch(e.coa_debit, isDebitNormal(e.coa_debit) ? e.jumlah : -e.jumlah);
      touch(e.coa_kredit, isDebitNormal(e.coa_kredit) ? -e.jumlah : e.jumlah);
    });

    return { success: true, balances: balances, coaByCode: coaByCode };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Same idea but for FLOW activity within a single month (or all months if
// monthStr is null) instead of a cumulative point-in-time balance - what
// Rugi Laba needs (revenue/expense during a period), as opposed to Neraca
// (balance as of a date).
function computeFlowBalances(monthStr) {
  try {
    const coaAll = getAll('Master_COA');
    if (!coaAll.success) return coaAll;
    const coaByCode = {};
    coaAll.data.forEach(c => { if (c.coa) coaByCode[c.coa.toString().trim()] = c; });

    const isDebitNormal = coa => {
      const rec = coaByCode[coa];
      const kat1 = rec ? (rec.kategori_1 || '').toString() : '';
      return kat1.startsWith('1.') || kat1.startsWith('2.') || kat1.startsWith('6.') || kat1.startsWith('7.') || kat1.startsWith('8.') || kat1.startsWith('9.');
    };
    const glResult = generateVirtualGL(monthStr);
    if (!glResult.success) return glResult;

    const balances = {};
    const touch = (coa, delta) => { balances[coa] = (balances[coa] || 0) + delta; };
    glResult.entries.forEach(e => {
      touch(e.coa_debit, isDebitNormal(e.coa_debit) ? e.jumlah : -e.jumlah);
      touch(e.coa_kredit, isDebitNormal(e.coa_kredit) ? -e.jumlah : e.jumlah);
    });
    return { success: true, balances: balances, coaByCode: coaByCode };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Sums every account whose kategori_2 matches the given label, ignoring
// its leading "N.N " numbering (the Neraca/RL template files and the COA
// file don't always agree on the exact number prefix for the same line -
// e.g. COA has "3.2 Kewajiban Lancar Lainnya" while the Neraca template
// calls the equivalent line "3.6 Kewajiban Lancar Lainnya" - matching on
// the descriptive text after the number sidesteps that mismatch).
function normalizeKat2(s) {
  return (s || '').toString().replace(/^\d+(\.\d+)?\s*/, '').trim().toLowerCase();
}
function sumByKategori2(balances, coaByCode, label) {
  const target = normalizeKat2(label);
  let sum = 0;
  Object.keys(balances).forEach(coa => {
    const rec = coaByCode[coa];
    if (rec && normalizeKat2(rec.kategori_2) === target) sum += balances[coa];
  });
  return sum;
}
function negateValues(values) {
  const out = {};
  Object.keys(values).forEach(k => { out[k] = parseFloat((-values[k]).toFixed(2)); });
  return out;
}
function getMonthsFromJan2026ToNow() {
  const months = [];
  let cursor = new Date(2026, 0, 1);
  const now = new Date();
  while (cursor.getFullYear() < now.getFullYear() || (cursor.getFullYear() === now.getFullYear() && cursor.getMonth() <= now.getMonth())) {
    months.push(`${cursor.getFullYear()}-${(cursor.getMonth() + 1).toString().padStart(2, '0')}`);
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}
function endOfMonth(yyyymm) {
  const [y, m] = yyyymm.split('-').map(Number);
  return new Date(y, m, 0);
}
const MONTH_NAMES_ID = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function monthLabel(yyyymm) {
  const [, m] = yyyymm.split('-').map(Number);
  return MONTH_NAMES_ID[m - 1];
}

// Finds GL entries referencing a COA code that isn't in Master_COA (these
// silently vanish from every Neraca/RL category total, since "(tidak
// dikenali: ...)" doesn't start with any recognized "N." prefix - a debit
// posted to a real account with no matching recognized credit, or vice
// versa, is exactly what causes Assets != Liabilities+Equity with no
// error thrown anywhere). Also flags entries with a malformed/blank date,
// which behave inconsistently between "Total" (unfiltered) and any
// specific month filter.
// Call: ?action=debugGLImbalance&callback=x
function debugGLImbalance() {
  try {
    const coaAll = getAll('Master_COA');
    if (!coaAll.success) return coaAll;
    const knownCoa = new Set(coaAll.data.map(c => (c.coa || '').toString().trim()).filter(c => c));

    const glResult = generateVirtualGL(null);
    if (!glResult.success) return glResult;

    const unrecognized = [];
    const malformedDate = [];
    glResult.entries.forEach(e => {
      const debitOk = knownCoa.has(e.coa_debit);
      const kreditOk = knownCoa.has(e.coa_kredit);
      if (!debitOk || !kreditOk) {
        unrecognized.push({
          tanggal: e.tanggal, coa_debit: e.coa_debit, debit_dikenali: debitOk,
          coa_kredit: e.coa_kredit, kredit_dikenali: kreditOk,
          jumlah: e.jumlah, keterangan: e.keterangan, sumber: e.sumber, referensi: e.referensi
        });
      }
      if (!e.tanggal || !/^\d{4}-\d{2}-\d{2}$/.test(e.tanggal)) {
        malformedDate.push({ tanggal: e.tanggal, keterangan: e.keterangan, sumber: e.sumber, referensi: e.referensi, jumlah: e.jumlah });
      }
    });

    const totalUnrecognizedImpact = unrecognized.reduce((s, e) => s + (!e.debit_dikenali ? e.jumlah : 0) - (!e.kredit_dikenali ? e.jumlah : 0), 0);

    return {
      success: true,
      total_entries_gl: glResult.entries.length,
      jumlah_entri_coa_tidak_dikenali: unrecognized.length,
      dampak_total_ke_imbalance: parseFloat(totalUnrecognizedImpact.toFixed(2)),
      contoh_entri_coa_tidak_dikenali: unrecognized.slice(0, 30),
      jumlah_entri_tanggal_bermasalah: malformedDate.length,
      contoh_entri_tanggal_bermasalah: malformedDate.slice(0, 10)
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function verifyNeracaBalance(asOfDate) {
  try {
    const result = computeAccountBalances(null);
    if (!result.success) return result;
    const balances = result.balances, coaByCode = result.coaByCode;

    let totalAktiva = 0, totalKewajiban = 0, totalModal = 0, totalPendapatan = 0, totalHppBiaya = 0;
    const detail = [];
    Object.keys(balances).forEach(coa => {
      const rec = coaByCode[coa];
      const kat1 = rec ? (rec.kategori_1 || '') : '(tidak dikenali: ' + coa + ')';
      const nilai = parseFloat(balances[coa].toFixed(2));
      detail.push({ coa: coa, nama_akun: rec ? rec.nama_akun : '', kategori_1: kat1, saldo: nilai });
      if (kat1.startsWith('1.') || kat1.startsWith('2.')) totalAktiva += nilai;
      else if (kat1.startsWith('3.')) totalKewajiban += nilai;
      else if (kat1.startsWith('4.')) totalModal += nilai;
      else if (kat1.startsWith('5.') || kat1.startsWith('8.')) totalPendapatan += nilai;
      else if (kat1.startsWith('6.') || kat1.startsWith('7.') || kat1.startsWith('9.')) totalHppBiaya += nilai;
    });

    const labaBerjalan = totalPendapatan - totalHppBiaya;
    const totalAsset = totalAktiva;
    const totalLiabilitiesEquity = totalKewajiban + totalModal + labaBerjalan;
    const selisih = parseFloat((totalAsset - totalLiabilitiesEquity).toFixed(2));

    return {
      success: true,
      total_aktiva: parseFloat(totalAktiva.toFixed(2)),
      total_kewajiban: parseFloat(totalKewajiban.toFixed(2)),
      total_modal_saldo_awal: parseFloat(totalModal.toFixed(2)),
      laba_berjalan: parseFloat(labaBerjalan.toFixed(2)),
      total_kewajiban_dan_modal: parseFloat(totalLiabilitiesEquity.toFixed(2)),
      selisih: selisih,
      balance: Math.abs(selisih) < 1,
      detail_per_akun: detail.sort((a, b) => a.coa.localeCompare(b.coa))
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Full Neraca matching the uploaded template's exact row structure, with a
// "Total" column (as of today) plus one column per month from Jan 2026 to
// the current month (each showing the balance as of that month's end).
// Lists every account with a nonzero cumulative balance and checks
// whether its kategori_2 matches one of the Neraca template's hardcoded
// row labels. Directly reveals any account correctly counted in the
// simple kategori_1 totals (verifyNeracaBalance) but silently missing
// from the row-by-row breakdown (generateNeracaReport) - which is exactly
// what would make "TOTAL ASSETS" computed by summing template rows
// disagree with the true total.
// Call: ?action=debugNeracaRowCoverage&callback=x
// Checks the distribution of status_bayar values in Pembelian_App - the GL
// treats anything not exactly "lunas" (case-insensitive) as still-unpaid
// debt, credited to Hutang Usaha. If status_bayar is blank or inconsistent
// for many historical rows, that alone would massively inflate Hutang
// Usaha even for purchases that were actually paid off long ago.
// Call: ?action=debugStatusBayar&callback=x
// Shows every distinct status_bayar/type_pembayaran value actually present
// in Pembelian_App and Penjualan_App, how many rows use it, the total
// rupiah, and exactly how the current GL logic classifies it (Kas / Bank /
// Hutang-Piutang) - directly diagnoses any Kas-vs-Bank misrouting instead
// of guessing at it.
// Call: ?action=debugKasBankMapping&callback=x
// Lists the actual rows for two specific anomalies found in
// debugKasBankMapping: (1) status_bayar=LUNAS with blank type_pembayaran
// (can't tell Kas from Bank without it), and (2) status_bayar=PIUTANG rows
// that somehow have type_pembayaran="Lunas Cash" (contradictory - paid in
// cash but still marked as owing) - shown with invoice/date/customer so
// each can be traced and checked individually.
// Call: ?action=debugAnehPenjualan&callback=x
// Directly corrects type_pembayaran for specific invoices in Penjualan_App
// (matches every line-item row for that invoice, since one invoice can
// span multiple rows). Embedded corrections are the ones confirmed
// manually against the real invoices.
const PENJUALAN_TYPE_PEMBAYARAN_CORRECTIONS = [
  ['INV1329', 'Lunas Cash'],
  ['INV1408', 'Lunas Transfer'],
  ['INV1272', 'Lunas Transfer'],
  ['INV1234', 'Lunas Transfer']
];
function fixPenjualanTypePembayaran() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Penjualan_App');
    if (!sheet) return { success: false, message: 'Sheet Penjualan_App not found' };
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: true, updated: 0 };
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const invIdx = headers.indexOf('no_invoice');
    const tipeIdx = headers.indexOf('type_pembayaran');
    if (invIdx === -1 || tipeIdx === -1) return { success: false, message: 'Kolom no_invoice/type_pembayaran tidak ditemukan' };

    const correctionMap = {};
    PENJUALAN_TYPE_PEMBAYARAN_CORRECTIONS.forEach(([inv, tipe]) => { correctionMap[inv.toString().trim().toUpperCase()] = tipe; });

    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    let updated = 0;
    const updatedRows = [];
    data.forEach((row, i) => {
      const inv = (row[invIdx] || '').toString().trim().toUpperCase();
      if (correctionMap[inv]) {
        const newTipe = correctionMap[inv];
        if (row[tipeIdx] !== newTipe) {
          sheet.getRange(i + 2, tipeIdx + 1).setValue(newTipe);
          updated++;
          updatedRows.push({ row: i + 2, no_invoice: row[invIdx], type_pembayaran_baru: newTipe });
        }
      }
    });
    return { success: true, updated: updated, detail: updatedRows };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Lists every Penjualan invoice whose GL entry pairs Kas (10100-00) with
// Penjualan revenue (40010-00), showing the exact status_bayar/
// type_pembayaran that caused it - so each can be checked against what
// actually happened, instead of guessing whether it's a data issue or a
// code issue.
// Call: ?action=debugPenjualanKasPairing&callback=x
// Product-level HPP summary: for every product sold, shows total quantity
// sold, the HPP/unit actually used (material-only, matching what
// generateVirtualGL uses for COGS), total COGS recognized, and which
// Assembly batch that HPP came from (with its raw material cost/output) -
// so a suspicious HPP jumps out per-product instead of needing to trace
// thousands of individual GL rows one at a time.
// Call: ?action=debugHppPerProduk&callback=x
// Read-only sanity check: current row count + a sample of first/last rows
// for Kas_Masuk and Pembelian_App - a quick baseline to compare against
// Google Sheets' Version History when data looks like it went missing.
// Call: ?action=debugSheetSnapshot&callback=x
// Isolates just the opening-balance (Saldo Awal) Piutang customers and
// shows their CURRENT computed balance + full detail trail (reusing
// generatePiutangHutangDetail's logic) - makes it easy to see which ones
// are still outstanding vs already cleared by a later payment, instead of
// scanning the full customer list for just these specific names.
// Call: ?action=debugSaldoAwalPiutangStatus&callback=x
// Clear Cash & Bank summary: opening balance, total in/out, current
// balance, broken down by category - answers "how much came in via cash
// vs transfer, how much went out via cash vs transfer, what's the
// balance of each" in one call instead of manually tracing the Buku
// Besar.
// Call: ?action=getRingkasanKasBank&callback=x
// One row per invoice: which payment (if any) cleared it, and a clear
// Lunas/Piutang status - a reconciliation view, distinct from the
// per-customer totals in generatePiutangHutangDetail().
// Shows every raw Penjualan_App row and every Kas_Masuk row referencing
// one specific invoice number (via no_invoice_ref OR no_dokumen) - lets
// any assumption about "one invoice number = one consistent total" be
// checked against the real data instead of guessed at.
// Call: ?action=debugInvoiceDetail&no_invoice=INV1325&callback=x
// Scans the ENTIRE dataset for every invoice where the reconciliation
// shows a genuine mismatch (CEK JUMLAH) - the full scope of remaining
// issues in one place, instead of finding them one screenshot at a time.
// Call: ?action=debugAllInvoiceMismatches&callback=x
function debugAllInvoiceMismatches() {
  try {
    const result = computePiutangReconciliationRows_();
    if (!result.success) return result;
    const mismatches = result.data.filter(r => r.status === 'CEK JUMLAH');
    const totalSelisih = mismatches.reduce((s, r) => {
      const match = /total bayar (-?\d+(\.\d+)?)/.exec(r.no_invoice_pembayaran);
      const totalBayar = match ? parseFloat(match[1]) : 0;
      return s + (totalBayar - r.jumlah);
    }, 0);
    return {
      success: true,
      jumlah_invoice_bermasalah: mismatches.length,
      total_invoice_diperiksa: result.data.length,
      total_selisih_rupiah: parseFloat(totalSelisih.toFixed(2)),
      detail: mismatches
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugInvoiceDetail(noInvoice) {
  try {
    const inv = (noInvoice || '').toString().trim();
    if (!inv) return { success: false, message: 'no_invoice kosong' };
    const penjualanAll = getAll('Penjualan_App');
    const kasMasukAll = getAll('Kas_Masuk');

    const penjualanRows = penjualanAll.success
      ? penjualanAll.data.filter(r => (r.no_invoice || '').toString().trim() === inv)
      : [];
    const kasMasukRows = kasMasukAll.success
      ? kasMasukAll.data.filter(r => (r.no_invoice_ref || '').toString().trim() === inv || (r.no_dokumen || '').toString().trim() === inv)
      : [];

    const distinctTotals = [...new Set(penjualanRows.map(r => parseFloat(r.total_tagihan) || parseFloat(r.total) || 0))];

    return {
      success: true,
      no_invoice: inv,
      jumlah_baris_penjualan: penjualanRows.length,
      total_tagihan_konsisten: distinctTotals.length <= 1,
      nilai_total_tagihan_yang_ditemukan: distinctTotals,
      baris_penjualan: penjualanRows,
      jumlah_baris_kas_masuk: kasMasukRows.length,
      total_kas_masuk: parseFloat(kasMasukRows.reduce((s, r) => s + (parseFloat(r.kas_masuk) || 0), 0).toFixed(2)),
      baris_kas_masuk: kasMasukRows
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Shared computation - same logic as before, just extracted so both the
// lightweight summary and the (optionally filtered) detail view can reuse
// it without duplicating the matching logic.
function computePiutangReconciliationRows_() {
  const penjualanAll = getAll('Penjualan_App');
  const kasMasukAll = getAll('Kas_Masuk');
  if (!penjualanAll.success) return penjualanAll;

  const invoiceMap = buildPenjualanInvoiceMap_(penjualanAll.data);

  const paymentByInvoice = {};
  if (kasMasukAll.success) {
    kasMasukAll.data.forEach(r => {
      const refField = (r.no_invoice_ref || '').toString().trim();
      const noDokumen = (r.no_dokumen || '').toString().trim();
      // Falls back to no_dokumen when no_invoice_ref is blank but
      // no_dokumen happens to exactly equal a real invoice number - a
      // common data-entry pattern (invoice number typed into the wrong
      // field). Exact match on a structured field, not a text search.
      const ref = refField || (invoiceMap[noDokumen] ? noDokumen : '');
      if (!ref || !invoiceMap[ref]) return;
      if (!paymentByInvoice[ref]) paymentByInvoice[ref] = [];
      paymentByInvoice[ref].push({ label: r.no_dokumen || r.id_kas, jumlah: parseFloat(r.kas_masuk) || 0 });
    });
  }

  const rows = Object.values(invoiceMap).map(inv => {
    const lunasAtSale = (inv.status_bayar || '').toString().trim().toLowerCase() === 'lunas';
    const kasPayments = paymentByInvoice[inv.no_invoice] || [];
    const totalPaid = kasPayments.reduce((s, p) => s + p.jumlah, 0);
    const isPaid = lunasAtSale || kasPayments.length > 0;
    // Flags a mismatch (e.g. two payments totaling more/less than the
    // invoice) directly, instead of silently marking it Lunas either way.
    const amountMismatch = !lunasAtSale && kasPayments.length > 0 && Math.abs(totalPaid - inv.total) > 0.5;
    let noPembayaran = lunasAtSale ? '(lunas saat penjualan)' : kasPayments.map(p => p.label).join(', ');
    if (amountMismatch) noPembayaran += ` [CEK: total bayar ${totalPaid} != jumlah invoice]`;
    return {
      no_invoice_piutang: inv.no_invoice,
      customer: inv.customer,
      tanggal: formatTanggalCell(inv.tanggal),
      jumlah: inv.total,
      no_invoice_pembayaran: noPembayaran,
      status: amountMismatch ? 'CEK JUMLAH' : (isPaid ? 'Lunas' : 'Piutang')
    };
  }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  return { success: true, data: rows };
}

// Lightweight: one row per customer (not per invoice) - loads fast even
// with hundreds of invoices, since a business typically has far fewer
// customers than invoices.
// Server-side cache (CacheService is shared across ALL users/devices, not
// per-browser) - once anyone successfully computes a result, everyone
// gets the cached version instantly until it expires, instead of every
// single request re-running the full computation. This is different from
// (and complementary to) reducing payload size: it addresses the case
// where the COMPUTATION itself is what's slow, not just the data transfer.
function withCache_(cacheKey, ttlSeconds, computeFn, forceRefresh) {
  const cache = CacheService.getScriptCache();
  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* fall through and recompute */ }
    }
  }
  const result = computeFn();
  if (result && result.success) {
    try {
      const serialized = JSON.stringify(result);
      if (serialized.length < 95000) cache.put(cacheKey, serialized, ttlSeconds); // CacheService caps values at 100KB
    } catch (e) { /* caching is best-effort - a failure here shouldn't break the response */ }
  }
  return result;
}

function generatePiutangReconciliationSummary(forceRefresh) {
  return withCache_('piutang_recon_summary', 600, () => {
    const result = computePiutangReconciliationRows_();
    if (!result.success) return result;
    const byCustomer = {};
    result.data.forEach(r => {
      if (!byCustomer[r.customer]) byCustomer[r.customer] = { customer: r.customer, jumlah_invoice: 0, jumlah_belum_lunas: 0, jumlah_cek: 0, total_belum_lunas: 0 };
      const c = byCustomer[r.customer];
      c.jumlah_invoice++;
      if (r.status === 'Piutang') { c.jumlah_belum_lunas++; c.total_belum_lunas += r.jumlah; }
      if (r.status === 'CEK JUMLAH') { c.jumlah_cek++; c.total_belum_lunas += r.jumlah; }
    });
    const rows = Object.values(byCustomer).sort((a, b) => b.total_belum_lunas - a.total_belum_lunas);
    return { success: true, data: rows };
  }, forceRefresh);
}

// Full detail, optionally filtered to one customer - only fetched when
// that customer's row is expanded in the UI, so a single request never
// has to carry all ~300+ invoices at once.
function generatePiutangReconciliation(customerFilter, forceRefresh) {
  return withCache_('piutang_recon_' + (customerFilter || 'ALL'), 600, () => {
    const result = computePiutangReconciliationRows_();
    if (!result.success) return result;
    if (!customerFilter) return result; // backward-compatible: no filter = everything (used by RUN_ and CSV export)
    return { success: true, data: result.data.filter(r => r.customer === customerFilter) };
  }, forceRefresh);
}

// Same idea for Hutang - one row per purchase document. Note: standalone
// "Pembayaran Hutang" transactions are a general debt paydown, not tied to
// one specific document, so they show in the aggregate per-supplier
// balance (generatePiutangHutangDetail) but can't mark one particular
// document Lunas here - only "paid at time of purchase" is unambiguous
// enough to show as such.
function computeHutangReconciliationRows_() {
  const pembelianAll = getAll('Pembelian_App');
  if (!pembelianAll.success) return pembelianAll;

  const dokumenMap = {};
  pembelianAll.data.forEach(r => {
    if ((r.kode_transaksi || '').toString().trim() !== 'Pembelian') return;
    const dok = (r.no_dokumen || '').toString().trim();
    const total = parseFloat(r.total) || 0;
    if (!dok || total <= 0 || dokumenMap[dok]) return;
    dokumenMap[dok] = { no_dokumen: dok, supplier: r.nama_supplier, total: total, tanggal: r.tanggal, status_bayar: r.status_bayar };
  });

  const rows = Object.values(dokumenMap).map(dok => {
    const lunasAtPurchase = (dok.status_bayar || '').toString().trim().toLowerCase().startsWith('lunas');
    return {
      no_dokumen_hutang: dok.no_dokumen,
      supplier: dok.supplier,
      tanggal: formatTanggalCell(dok.tanggal),
      jumlah: dok.total,
      no_dokumen_pembayaran: lunasAtPurchase ? '(lunas saat pembelian)' : '',
      status: lunasAtPurchase ? 'Lunas' : 'Hutang'
    };
  }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  return { success: true, data: rows };
}

function generateHutangReconciliationSummary(forceRefresh) {
  return withCache_('hutang_recon_summary', 600, () => {
    const result = computeHutangReconciliationRows_();
    if (!result.success) return result;
    const bySupplier = {};
    result.data.forEach(r => {
      if (!bySupplier[r.supplier]) bySupplier[r.supplier] = { supplier: r.supplier, jumlah_dokumen: 0, jumlah_belum_lunas: 0, total_belum_lunas: 0 };
      const s = bySupplier[r.supplier];
      s.jumlah_dokumen++;
      if (r.status === 'Hutang') { s.jumlah_belum_lunas++; s.total_belum_lunas += r.jumlah; }
    });
    const rows = Object.values(bySupplier).sort((a, b) => b.total_belum_lunas - a.total_belum_lunas);
    return { success: true, data: rows };
  }, forceRefresh);
}

function generateHutangReconciliation(supplierFilter, forceRefresh) {
  return withCache_('hutang_recon_' + (supplierFilter || 'ALL'), 600, () => {
    const result = computeHutangReconciliationRows_();
    if (!result.success) return result;
    const filtered = supplierFilter ? result.data.filter(r => r.supplier === supplierFilter) : result.data;
    return { success: true, data: filtered, catatan: 'Cicilan Pembayaran Hutang terpisah (bukan lunas saat beli) tidak terikat ke 1 dokumen tertentu, jadi tidak melunaskan baris spesifik di sini - itu mengurangi saldo total per supplier di tab ringkasan.' };
  }, forceRefresh);
}

function getRingkasanKasBank() {
  try {
    const ctx = buildReportContext();
    if (!ctx.success) return ctx;

    const summarize = coaTarget => {
      const openingBalance = ctx.openingBalances[coaTarget] || 0;
      let totalMasuk = 0, totalKeluar = 0;
      const masukByCategory = {}, keluarByCategory = {};
      ctx.entries.forEach(e => {
        if (e.coa_debit === coaTarget) {
          totalMasuk += e.jumlah;
          const kat = (ctx.coaByCode[e.coa_kredit] || {}).nama_akun || e.coa_kredit;
          masukByCategory[kat] = (masukByCategory[kat] || 0) + e.jumlah;
        }
        if (e.coa_kredit === coaTarget) {
          totalKeluar += e.jumlah;
          const kat = (ctx.coaByCode[e.coa_debit] || {}).nama_akun || e.coa_debit;
          keluarByCategory[kat] = (keluarByCategory[kat] || 0) + e.jumlah;
        }
      });
      const toSortedList = obj => Object.keys(obj).map(k => ({ kategori: k, total: parseFloat(obj[k].toFixed(2)) })).sort((a, b) => b.total - a.total);
      return {
        saldo_awal_1jan: parseFloat(openingBalance.toFixed(2)),
        total_masuk: parseFloat(totalMasuk.toFixed(2)),
        total_keluar: parseFloat(totalKeluar.toFixed(2)),
        saldo_sekarang: parseFloat((openingBalance + totalMasuk - totalKeluar).toFixed(2)),
        rincian_masuk: toSortedList(masukByCategory),
        rincian_keluar: toSortedList(keluarByCategory)
      };
    };

    return {
      success: true,
      kas_tunai: summarize(COA_KAS),
      bank_bca: summarize(COA_BANK_BCA),
      total_kas_dan_bank: parseFloat(((ctx.openingBalances[COA_KAS] || 0) + (ctx.openingBalances[COA_BANK_BCA] || 0) +
        ctx.entries.reduce((s, e) => s + (e.coa_debit === COA_KAS || e.coa_debit === COA_BANK_BCA ? e.jumlah : 0) - (e.coa_kredit === COA_KAS || e.coa_kredit === COA_BANK_BCA ? e.jumlah : 0), 0)).toFixed(2))
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugSaldoAwalPiutangStatus() {
  try {
    const saldoAwalAll = getAll('Saldo_Awal');
    if (!saldoAwalAll.success) return saldoAwalAll;
    const saldoAwalCustomers = saldoAwalAll.data
      .filter(r => r.kategori === 'Piutang')
      .map(r => ({ nama: (r.nama_akun || '').toString().trim(), saldo_awal_asli: parseFloat(r.saldo_awal) || 0 }));

    const detailResult = generatePiutangHutangDetail();
    if (!detailResult.success) return detailResult;
    const currentByName = {};
    detailResult.piutang.forEach(c => { currentByName[c.nama.toLowerCase()] = c; });

    const rows = saldoAwalCustomers.map(sa => {
      const current = currentByName[sa.nama.toLowerCase()];
      return {
        customer: sa.nama,
        saldo_awal_asli_1jan: sa.saldo_awal_asli,
        saldo_sekarang: current ? current.saldo : 0,
        status: current ? (Math.abs(current.saldo) < 0.5 ? 'LUNAS (saldo 0)' : 'MASIH ADA SALDO') : 'LUNAS (tidak muncul di daftar piutang)',
        detail_transaksi: current ? current.detail : []
      };
    });

    const totalAsli = rows.reduce((s, r) => s + r.saldo_awal_asli_1jan, 0);
    const totalSekarang = rows.reduce((s, r) => s + r.saldo_sekarang, 0);
    return { success: true, jumlah_customer: rows.length, total_saldo_awal_asli: parseFloat(totalAsli.toFixed(2)), total_saldo_sekarang: parseFloat(totalSekarang.toFixed(2)), data: rows };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugSheetSnapshot() {
  try {
    const out = {};
    ['Kas_Masuk', 'Pembelian_App'].forEach(tableName => {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName(tableName);
      if (!sheet) { out[tableName] = { error: 'Sheet tidak ditemukan' }; return; }
      const lastRow = sheet.getLastRow();
      const rowCount = Math.max(0, lastRow - 1);
      const headers = lastRow > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
      let firstRows = [], lastRows = [];
      if (rowCount > 0) {
        const firstN = Math.min(3, rowCount);
        firstRows = sheet.getRange(2, 1, firstN, sheet.getLastColumn()).getValues();
        const lastN = Math.min(3, rowCount);
        lastRows = sheet.getRange(lastRow - lastN + 1, 1, lastN, sheet.getLastColumn()).getValues();
      }
      const toObjects = rows => rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });
      out[tableName] = { jumlah_baris_data: rowCount, contoh_baris_pertama: toObjects(firstRows), contoh_baris_terakhir: toObjects(lastRows) };
    });
    return { success: true, data: out };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugHppPerProduk() {
  try {
    const penjualanAll = getAll('Penjualan_App');
    const assemblyAll = getAll('Assembly_Entry');
    const produkAll = getAll('Master_Produk');
    if (!penjualanAll.success || !assemblyAll.success || !produkAll.success) {
      return { success: false, message: 'Gagal ambil data' };
    }
    const produkIdByName = {};
    produkAll.data.forEach(p => { if (p.nama_produk) produkIdByName[p.nama_produk.toString().trim().toLowerCase()] = p.id_produk; });

    // Latest Assembly batch per product (material-only HPP + its source data).
    const latestBatch = {};
    assemblyAll.data.forEach(r => {
      const id = (r.sku || '').toString().trim();
      const qty = parseFloat(r.jumlah_produksi) || 0;
      const materialTotal = parseFloat(r.total_harga_material) || 0;
      if (!id || qty <= 0 || materialTotal <= 0) return;
      const existing = latestBatch[id];
      if (!existing || new Date(r.tanggal) > new Date(existing.tanggal)) {
        latestBatch[id] = { tanggal: r.tanggal, batch_no: r.batch_no, jumlah_produksi: qty, total_harga_material: materialTotal, hpp_per_unit: materialTotal / qty };
      }
    });
    // Fallback: full HPP field on Assembly_Entry (includes old overhead-era data).
    const latestFullHpp = {};
    assemblyAll.data.forEach(r => {
      const id = (r.sku || '').toString().trim();
      const hpp = parseFloat(r.hpp) || 0;
      if (!id || hpp <= 0) return;
      const existing = latestFullHpp[id];
      if (!existing || new Date(r.tanggal) > new Date(existing.tanggal)) latestFullHpp[id] = { tanggal: r.tanggal, hpp: hpp };
    });

    const perProduk = {};
    penjualanAll.data.forEach(r => {
      if ((r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample') return;
      const nama = (r.nama_barang || '').toString().trim();
      const jumlah = parseFloat(r.jumlah) || 0;
      if (!nama || jumlah <= 0) return;
      if (!perProduk[nama]) perProduk[nama] = { nama_produk: nama, total_qty_terjual: 0 };
      perProduk[nama].total_qty_terjual += jumlah;
    });

    const rows = Object.values(perProduk).map(p => {
      const id = produkIdByName[p.nama_produk.toLowerCase()] || '';
      const batch = latestBatch[id];
      const fullHpp = latestFullHpp[id];
      const hppUnitUsed = batch ? batch.hpp_per_unit : (fullHpp ? fullHpp.hpp : 0);
      return {
        nama_produk: p.nama_produk,
        total_qty_terjual: parseFloat(p.total_qty_terjual.toFixed(2)),
        hpp_per_unit_dipakai: parseFloat(hppUnitUsed.toFixed(2)),
        total_hpp_diakui: parseFloat((hppUnitUsed * p.total_qty_terjual).toFixed(2)),
        sumber_hpp: batch ? ('Assembly batch ' + batch.batch_no + ' (' + formatTanggalCell(batch.tanggal) + ')') : (fullHpp ? ('Assembly_Entry.hpp (' + formatTanggalCell(fullHpp.tanggal) + ', mungkin era lama termasuk overhead)') : 'TIDAK ADA - HPP 0'),
        batch_jumlah_produksi: batch ? batch.jumlah_produksi : null,
        batch_total_harga_material: batch ? batch.total_harga_material : null
      };
    }).sort((a, b) => b.total_hpp_diakui - a.total_hpp_diakui);

    return { success: true, data: rows };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugPenjualanKasPairing() {
  try {
    const penjualanAll = getAll('Penjualan_App');
    if (!penjualanAll.success) return penjualanAll;

    const invoiceMap = buildPenjualanInvoiceMap_(penjualanAll.data);
    const kasPairedInvoices = [];
    const bankPairedInvoices = [];
    const piutangPairedInvoices = [];
    Object.values(invoiceMap).forEach(inv => {
      const lunas = (inv.status_bayar || '').toString().trim().toLowerCase() === 'lunas';
      const row = { no_invoice: inv.no_invoice, customer: inv.customer, total: inv.total, status_bayar: inv.status_bayar, type_pembayaran: inv.type_pembayaran, tanggal: inv.tanggal };
      if (!lunas) { piutangPairedInvoices.push(row); return; }
      const resolved = resolveCashAccount(inv.type_pembayaran);
      if (resolved === COA_KAS) kasPairedInvoices.push(row);
      else bankPairedInvoices.push(row);
    });

    return {
      success: true,
      dipasangkan_ke_KAS: { jumlah: kasPairedInvoices.length, contoh: kasPairedInvoices.slice(0, 30) },
      dipasangkan_ke_BANK: { jumlah: bankPairedInvoices.length },
      dipasangkan_ke_PIUTANG: { jumlah: piutangPairedInvoices.length }
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugAnehPenjualan() {
  try {
    const penjualanAll = getAll('Penjualan_App');
    if (!penjualanAll.success) return penjualanAll;

    const lunasTanpaTipe = [];
    const piutangTapiLunasCash = [];
    penjualanAll.data.forEach(r => {
      const statusRaw = (r.status_bayar || '').toString().trim();
      const tipeRaw = (r.type_pembayaran || '').toString().trim();
      const row = {
        no_invoice: r.no_invoice, tanggal: r.tanggal, customer: r.customer,
        nama_barang: r.nama_barang, total: parseFloat(r.total_tagihan) || parseFloat(r.total) || 0,
        status_bayar: r.status_bayar, type_pembayaran: r.type_pembayaran, sumber_baris: r.sumber_baris
      };
      if (statusRaw.toUpperCase() === 'LUNAS' && !tipeRaw) lunasTanpaTipe.push(row);
      if (statusRaw.toUpperCase() === 'PIUTANG' && tipeRaw.toLowerCase().includes('cash')) piutangTapiLunasCash.push(row);
    });

    return {
      success: true,
      lunas_tanpa_type_pembayaran: { jumlah: lunasTanpaTipe.length, baris: lunasTanpaTipe },
      piutang_tapi_type_lunas_cash: { jumlah: piutangTapiLunasCash.length, baris: piutangTapiLunasCash }
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugKasBankMapping() {
  try {
    const pembelianAll = getAll('Pembelian_App');
    const penjualanAll = getAll('Penjualan_App');
    const kasMasukAll = getAll('Kas_Masuk');

    const pembelianBreakdown = {};
    if (pembelianAll.success) {
      pembelianAll.data.forEach(r => {
        const kode = (r.kode_transaksi || '').toString().trim();
        if (kode !== 'Pembelian' && kode !== 'Pembelian Biaya') return;
        const raw = (r.status_bayar || '').toString();
        const key = raw === '' ? '(kosong)' : raw;
        const statusLower = raw.trim().toLowerCase();
        const lunas = statusLower.startsWith('lunas');
        const classification = !lunas ? 'HUTANG' : (resolveCashAccount(raw) === COA_KAS ? 'KAS' : 'BANK');
        if (!pembelianBreakdown[key]) pembelianBreakdown[key] = { jumlah_baris: 0, total_rupiah: 0, diklasifikasikan_sebagai: classification };
        pembelianBreakdown[key].jumlah_baris++;
        pembelianBreakdown[key].total_rupiah += parseFloat(r.total) || 0;
      });
      Object.values(pembelianBreakdown).forEach(v => { v.total_rupiah = parseFloat(v.total_rupiah.toFixed(2)); });
    }

    const penjualanBreakdown = {};
    if (penjualanAll.success) {
      penjualanAll.data.forEach(r => {
        if ((r.kode_transaksi || '').toString().trim().toLowerCase() === 'sample') return;
        const rawStatus = (r.status_bayar || '').toString();
        const rawTipe = (r.type_pembayaran || '').toString();
        const key = 'status_bayar=' + (rawStatus || '(kosong)') + ' | type_pembayaran=' + (rawTipe || '(kosong)');
        const lunas = rawStatus.trim().toLowerCase() === 'lunas';
        const classification = !lunas ? 'PIUTANG' : (resolveCashAccount(rawTipe) === COA_KAS ? 'KAS' : 'BANK');
        if (!penjualanBreakdown[key]) penjualanBreakdown[key] = { jumlah_baris: 0, total_rupiah: 0, diklasifikasikan_sebagai: classification };
        penjualanBreakdown[key].jumlah_baris++;
        penjualanBreakdown[key].total_rupiah += parseFloat(r.total_tagihan) || parseFloat(r.total) || 0;
      });
      Object.values(penjualanBreakdown).forEach(v => { v.total_rupiah = parseFloat(v.total_rupiah.toFixed(2)); });
    }

    const kasMasukBreakdown = {};
    if (kasMasukAll.success) {
      kasMasukAll.data.forEach(r => {
        const raw = (r.cash_account || '').toString();
        const key = raw === '' ? '(kosong)' : raw;
        const resolved = resolveCashAccount(raw);
        const classification = resolved === COA_KAS ? 'KAS' : (resolved === COA_BANK_BCA ? 'BANK' : 'TIDAK DIKENALI (fallback ke Bank)');
        if (!kasMasukBreakdown[key]) kasMasukBreakdown[key] = { jumlah_baris: 0, total_rupiah: 0, diklasifikasikan_sebagai: classification };
        kasMasukBreakdown[key].jumlah_baris++;
        kasMasukBreakdown[key].total_rupiah += parseFloat(r.kas_masuk) || 0;
      });
      Object.values(kasMasukBreakdown).forEach(v => { v.total_rupiah = parseFloat(v.total_rupiah.toFixed(2)); });
    }

    return {
      success: true,
      pembelian_status_bayar_breakdown: pembelianBreakdown,
      penjualan_status_tipe_breakdown: penjualanBreakdown,
      kas_masuk_cash_account_breakdown: kasMasukBreakdown
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugStatusBayar() {
  try {
    const pembelianAll = getAll('Pembelian_App');
    if (!pembelianAll.success) return pembelianAll;
    const breakdown = {};
    let totalBelumLunasRupiah = 0;
    const contohBelumLunas = [];
    pembelianAll.data.forEach(r => {
      const status = (r.status_bayar || '(kosong)').toString().trim();
      const key = status || '(kosong)';
      if (!breakdown[key]) breakdown[key] = { jumlah_baris: 0, total_rupiah: 0 };
      breakdown[key].jumlah_baris++;
      const total = parseFloat(r.total) || 0;
      breakdown[key].total_rupiah += total;
      if (status.toLowerCase() !== 'lunas') {
        totalBelumLunasRupiah += total;
        if (contohBelumLunas.length < 15) {
          contohBelumLunas.push({ tanggal: r.tanggal, nama_barang: r.nama_barang, nama_supplier: r.nama_supplier, status_bayar: r.status_bayar || '(kosong)', total: total, no_dokumen: r.no_dokumen });
        }
      }
    });
    Object.keys(breakdown).forEach(k => { breakdown[k].total_rupiah = parseFloat(breakdown[k].total_rupiah.toFixed(2)); });
    return {
      success: true,
      breakdown_status_bayar: breakdown,
      total_dianggap_belum_lunas_rupiah: parseFloat(totalBelumLunasRupiah.toFixed(2)),
      contoh_baris_belum_lunas: contohBelumLunas
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function debugNeracaRowCoverage() {
  try {
    const NERACA_LABELS = [
      '1.1 Kas', '1.2 Bank', '1.3 Investasi Sementara', '1.3 Piutang Usaha Pihak Ketiga', '1.3 Piutang Usaha Inter Co',
      '1.3 Piutang Lain-Lain Pihak Ketiga', '1.3 Piutang Lain-Lain Inter Co', '1.3 Penyisihan piutang Ragu-ragu', '1.4 Persediaan',
      '1.5 Beban Dibayar Dimuka', '1.5 Uang Muka Pembelian', '1.6 Aktiva Lancar Lainnya',
      '2.1 Piutang Jangka Panjang', '2.1 Tanah dan Bangunan', '2.2 Aktiva Tetap Lainnya', '2.3 Akumulasi Penyusutan',
      '2.5 Investasi Jangka Panjang Lainnya', '2.5 Harta Tidak Berwujud', '2.6 Aktiva Pajak Tangguhan', '2.7 Aktiva Tidak Lancar Lainnya',
      '3.1 Hutang Usaha Pihak Ketiga', '3.1 Hutang Usaha Inter Co', '3.3 Hutang Bunga', '3.3 Hutang Pajak', '3.3 Hutang Deviden',
      '3.4 Biaya Yang Masih Harus Dibayar', '3.3 Hutang Bank', '3.5 Hutang Jangka Panjang Yg Jatuh Tempo', '3.6 Kewajiban Lancar Lainnya',
      '3.5 Hutang Usaha Jangka Panjang Pihak Ketiga', '3.5 Hutang Usaha Jangka Panjang Inter Co', '3.6 Kewajiban Pajak Tangguhan',
      '3.7 Long term liabilities', '3.8 Long term liabilities', '3.9 Kewajiban Tidak Lancar Lainnya',
      '4.1 Modal Saham', '4.1 Agio Saham', '4.2 Penarikan Modal', '4.3 Deviden', '4.4 Laba Ditahan Tahun Tahun Sebelumnya'
    ];
    const normalizedTemplateLabels = new Set(NERACA_LABELS.map(normalizeKat2));

    const result = computeAccountBalances(null);
    if (!result.success) return result;
    const { balances, coaByCode } = result;

    const covered = [], orphaned = [];
    Object.keys(balances).forEach(coa => {
      const nilai = parseFloat(balances[coa].toFixed(2));
      if (Math.abs(nilai) < 0.01) return;
      const rec = coaByCode[coa];
      const kat1 = rec ? (rec.kategori_1 || '') : '';
      const kat2 = rec ? (rec.kategori_2 || '') : '';
      const nama = rec ? rec.nama_akun : '';
      const isAsset = kat1.startsWith('1.') || kat1.startsWith('2.');
      const entry = { coa: coa, nama_akun: nama, kategori_1: kat1, kategori_2: kat2, saldo: nilai };
      if (!isAsset) return; // focus on the Aktiva side, since that's where the shortfall is
      if (normalizedTemplateLabels.has(normalizeKat2(kat2))) covered.push(entry);
      else orphaned.push(entry);
    });

    return {
      success: true,
      akun_aktiva_tercakup_di_template: covered.length,
      akun_aktiva_TIDAK_tercakup_di_template: orphaned.length,
      detail_akun_yang_hilang_dari_rincian: orphaned,
      total_nilai_yang_hilang: parseFloat(orphaned.reduce((s, e) => s + e.saldo, 0).toFixed(2))
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function generateNeracaReport() {
  try {
    const months = getMonthsFromJan2026ToNow();
    const monthCols = months.map(monthLabel);
    const columns = ['Total'].concat(monthCols);

    const ctx = buildReportContext();
    if (!ctx.success) return ctx;
    const coaByCode = ctx.coaByCode;

    const balancesForColumn = { Total: accountBalancesFromContext(ctx, null) };
    months.forEach((m, i) => {
      balancesForColumn[monthCols[i]] = accountBalancesFromContext(ctx, endOfMonth(m));
    });

    const rows = [];
    const rowValues = label => {
      const values = {};
      columns.forEach(col => { values[col] = parseFloat(sumByKategori2(balancesForColumn[col], coaByCode, label).toFixed(2)); });
      return values;
    };
    const pushRow = (label, values) => { rows.push({ label: label, values: values }); return values; };
    const pushSeparator = () => rows.push({ separator: true });
    const pushTotal = (label, valuesList) => {
      const values = {};
      columns.forEach(col => { values[col] = parseFloat(valuesList.reduce((s, v) => s + (v[col] || 0), 0).toFixed(2)); });
      rows.push({ label: label, values: values, isTotal: true });
      return values;
    };
    // Any account whose kategori_1 matches a section but whose kategori_2
    // doesn't match one of that section's explicit rows below (e.g. a
    // generic/header-level COA like "2.0 Fixed Asset" that predates the
    // more specific "2.1"/"2.2" sub-accounts) gets folded into the given
    // catch-all row instead of silently vanishing from the total - this is
    // what makes "TOTAL ASSETS" always equal the true sum instead of only
    // covering whatever the ~40 hardcoded template rows happen to name.
    const foldResidualIntoLastRow = (col, kat1Prefixes, explicitLabels) => {
      const bal = balancesForColumn[col];
      const explicitNormalized = new Set(explicitLabels.map(normalizeKat2));
      let residual = 0;
      Object.keys(bal).forEach(coa => {
        const rec = coaByCode[coa];
        if (!rec) return;
        const kat1 = (rec.kategori_1 || '').toString();
        if (!kat1Prefixes.some(p => kat1.startsWith(p))) return;
        if (!explicitNormalized.has(normalizeKat2(rec.kategori_2))) residual += bal[coa];
      });
      return residual;
    };
    const rowValuesWithCatchAll = (labels, kat1Prefixes, catchAllIndex) => {
      const valuesList = labels.map(rowValues);
      columns.forEach(col => {
        const residual = foldResidualIntoLastRow(col, kat1Prefixes, labels);
        if (residual) valuesList[catchAllIndex][col] = parseFloat((valuesList[catchAllIndex][col] + residual).toFixed(2));
      });
      return valuesList;
    };

    const aktivaLancarLabels = ['1.1 Kas', '1.2 Bank', '1.3 Investasi Sementara', '1.3 Piutang Usaha Pihak Ketiga', '1.3 Piutang Usaha Inter Co',
      '1.3 Piutang Lain-Lain Pihak Ketiga', '1.3 Piutang Lain-Lain Inter Co', '1.3 Penyisihan piutang Ragu-ragu', '1.4 Persediaan',
      '1.5 Beban Dibayar Dimuka', '1.5 Uang Muka Pembelian', '1.6 Aktiva Lancar Lainnya'];
    const aktivaLancar = rowValuesWithCatchAll(aktivaLancarLabels, ['1.'], aktivaLancarLabels.length - 1).map((v, i) => pushRow(aktivaLancarLabels[i], v));
    const totalAktivaLancar = pushTotal('TOTAL AKTIVA LANCAR', aktivaLancar);
    pushSeparator();

    const aktivaTidakLancarLabels = ['2.1 Piutang Jangka Panjang', '2.1 Tanah dan Bangunan', '2.2 Aktiva Tetap Lainnya', '2.3 Akumulasi Penyusutan',
      '2.5 Investasi Jangka Panjang Lainnya', '2.5 Harta Tidak Berwujud', '2.6 Aktiva Pajak Tangguhan', '2.7 Aktiva Tidak Lancar Lainnya'];
    const aktivaTidakLancar = rowValuesWithCatchAll(aktivaTidakLancarLabels, ['2.'], aktivaTidakLancarLabels.length - 1).map((v, i) => pushRow(aktivaTidakLancarLabels[i], v));
    const totalAktivaTidakLancar = pushTotal('TOTAL AKTIVA TIDAK LANCAR', aktivaTidakLancar);
    const totalAssets = pushTotal('TOTAL ASSETS', [totalAktivaLancar, totalAktivaTidakLancar]);
    pushSeparator();

    // Kewajiban Lancar + Tidak Lancar share kategori_1 "3." with no clean
    // sub-split at that level, so any residual across BOTH sections' rows
    // combined is folded into Kewajiban Lancar's catch-all - the more
    // common case for miscellaneous/unclassified liabilities.
    const kewajibanLancarLabels = ['3.1 Hutang Usaha Pihak Ketiga', '3.1 Hutang Usaha Inter Co', '3.3 Hutang Bunga', '3.3 Hutang Pajak',
      '3.3 Hutang Deviden', '3.4 Biaya Yang Masih Harus Dibayar', '3.3 Hutang Bank', '3.5 Hutang Jangka Panjang Yg Jatuh Tempo',
      '3.6 Kewajiban Lancar Lainnya'];
    const kewajibanTidakLancarLabels = ['3.5 Hutang Usaha Jangka Panjang Pihak Ketiga', '3.5 Hutang Usaha Jangka Panjang Inter Co',
      '3.6 Kewajiban Pajak Tangguhan', '3.7 Long term liabilities', '3.8 Long term liabilities', '3.9 Kewajiban Tidak Lancar Lainnya'];
    const allKewajibanLabels = kewajibanLancarLabels.concat(kewajibanTidakLancarLabels);
    const kewajibanLancarValues = kewajibanLancarLabels.map(rowValues);
    columns.forEach(col => {
      const residual = foldResidualIntoLastRow(col, ['3.'], allKewajibanLabels);
      if (residual) kewajibanLancarValues[kewajibanLancarValues.length - 1][col] = parseFloat((kewajibanLancarValues[kewajibanLancarValues.length - 1][col] + residual).toFixed(2));
    });
    const kewajibanLancar = kewajibanLancarValues.map((v, i) => pushRow(kewajibanLancarLabels[i], v));
    const totalKewajibanLancar = pushTotal('TOTAL KEWAJIBAN LANCAR', kewajibanLancar);
    pushSeparator();

    const kewajibanTidakLancar = kewajibanTidakLancarLabels.map(label => pushRow(label, rowValues(label)));
    const totalKewajibanTidakLancar = pushTotal('TOTAL KEWAJIBAN TIDAK LANCAR', kewajibanTidakLancar);
    pushSeparator();

    const modalLabels = ['4.1 Modal Saham', '4.1 Agio Saham', '4.2 Penarikan Modal', '4.3 Deviden', '4.4 Laba Ditahan Tahun Tahun Sebelumnya'];
    const modal = rowValuesWithCatchAll(modalLabels, ['4.'], 0).map((v, i) => pushRow(modalLabels[i], v));

    // Laba Berjalan: cumulative Pendapatan - HPP - Biaya as of each
    // column's cutoff (matches "current-year profit not yet closed to
    // Retained Earnings" - the standard Neraca treatment).
    const labaBerjalanValues = {};
    columns.forEach(col => {
      const bal = balancesForColumn[col];
      let pendapatan = 0, hppBiaya = 0;
      Object.keys(bal).forEach(coa => {
        const rec = coaByCode[coa];
        const kat1 = rec ? (rec.kategori_1 || '') : '';
        if (kat1.startsWith('5.') || kat1.startsWith('8.')) pendapatan += bal[coa];
        else if (kat1.startsWith('6.') || kat1.startsWith('7.') || kat1.startsWith('9.')) hppBiaya += bal[coa];
      });
      labaBerjalanValues[col] = parseFloat((pendapatan - hppBiaya).toFixed(2));
    });
    pushRow('Laba Berjalan', labaBerjalanValues);

    const totalModal = pushTotal('TOTAL MODAL', modal.concat([labaBerjalanValues]));
    const totalKewajibanDanModal = pushTotal('TOTAL KEWAJIBAN DAN MODAL', [totalKewajibanLancar, totalKewajibanTidakLancar, totalModal]);

    const selisihPerKolom = {};
    columns.forEach(col => { selisihPerKolom[col] = parseFloat((totalAssets[col] - totalKewajibanDanModal[col]).toFixed(2)); });

    return { success: true, columns: columns, rows: rows, selisih_per_kolom: selisihPerKolom, balance: Object.values(selisihPerKolom).every(v => Math.abs(v) < 1) };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// Full Rugi Laba matching the uploaded template's exact row structure,
// with a "Total" column (all activity since Jan 2026) plus one column per
// month (activity WITHIN that month only - a flow, not a cumulative
// balance like Neraca).
function generateRugiLabaReportDetailed() {
  try {
    const months = getMonthsFromJan2026ToNow();
    const monthCols = months.map(monthLabel);
    const columns = ['Total'].concat(monthCols);

    const ctx = buildReportContext();
    if (!ctx.success) return ctx;
    const coaByCode = ctx.coaByCode;

    const balancesForColumn = { Total: flowBalancesFromContext(ctx, null) };
    months.forEach((m, i) => {
      balancesForColumn[monthCols[i]] = flowBalancesFromContext(ctx, m);
    });

    const rows = [];
    const rowValues = label => {
      const values = {};
      columns.forEach(col => { values[col] = parseFloat(sumByKategori2(balancesForColumn[col], coaByCode, label).toFixed(2)); });
      return values;
    };
    const pushRow = (label, values) => { rows.push({ label: label, values: values }); return values; };
    const pushSeparator = () => rows.push({ separator: true });
    const combine = (label, terms, isTotal) => {
      // terms = [{ values, sign }]
      const values = {};
      columns.forEach(col => {
        let v = 0;
        terms.forEach(t => { v += (t.values[col] || 0) * t.sign; });
        values[col] = parseFloat(v.toFixed(2));
      });
      rows.push({ label: label, values: values, isTotal: !!isTotal });
      return values;
    };

    // Revenue accounts (5.x) are credit-normal, so their balance in the
    // debit-positive convention above comes out negative for genuine
    // revenue - negated here so Penjualan displays as a positive number.
    // Revenue accounts (5.x, 8.1) are credit-normal, and the touch logic
    // in computeFlowBalances already gives them their natural-positive
    // sign when they hold a normal credit balance - no negation needed
    // (an earlier version of this code incorrectly negated them, which
    // flipped genuine revenue into a negative number and cascaded into a
    // wildly wrong LABA KOTOR/LABA BERSIH).
    const penjualanBarang = pushRow('5.1 Penjualan Barang', rowValues('5.1 Penjualan Barang'));
    const pendapatanJasa = pushRow('5.2 Pendapatan Jasa', rowValues('5.2 Pendapatan Jasa'));
    const totalPenjualan = combine('Total Penjualan', [{ values: penjualanBarang, sign: 1 }, { values: pendapatanJasa, sign: 1 }], true);
    pushSeparator();

    const hpp = pushRow('6.1 Harga Pokok Penjualan', rowValues('6.1 Harga Pokok Penjualan'));
    const factoryOverhead = pushRow('6.2 Factory Overhead', rowValues('6.2 Factory Overhead'));
    const totalHpp = combine('Total Harga Pokok Penjualan', [{ values: hpp, sign: 1 }, { values: factoryOverhead, sign: 1 }], true);
    const labaKotor = combine('LABA KOTOR', [{ values: totalPenjualan, sign: 1 }, { values: totalHpp, sign: -1 }], true);
    pushSeparator();

    const biayaGaji = pushRow('7.1 Biaya Gaji dan Upah', rowValues('7.1 Biaya Gaji dan Upah'));
    const biayaKantor = pushRow('7.2 Biaya Kantor', rowValues('7.2 Biaya Kantor'));
    const biayaPemasaran = pushRow('7.3 Biaya Pemasaran', rowValues('7.3 Biaya Pemasaran'));
    const biayaPerbaikan = pushRow('7.4 Biaya Perbaikan', rowValues('7.4 Biaya Perbaikan'));
    const biayaPenyusutan = pushRow('7.5 Biaya Penyusutan', rowValues('7.5 Biaya Penyusutan'));
    const biayaOpsLainnya = pushRow('7.9 Biaya Operasional Lainnya', rowValues('7.9 Biaya Operasional Lainnya'));
    const totalBiayaOps = combine('Total Biaya Operasional', [biayaGaji, biayaKantor, biayaPemasaran, biayaPerbaikan, biayaPenyusutan, biayaOpsLainnya].map(v => ({ values: v, sign: 1 })), true);
    const labaOperasional = combine('LABA OPERASIONAL', [{ values: labaKotor, sign: 1 }, { values: totalBiayaOps, sign: -1 }], true);
    pushSeparator();

    const pendapatanLain = pushRow('8.1 Pendapatan Lain-Lain', rowValues('8.1 Pendapatan Lain-Lain'));
    const biayaLain = pushRow('8.2 Biaya Lain-Lain', rowValues('8.2 Biaya Lain-Lain'));
    const totalPendapatanLainnya = combine('Total Pendapatan Lainnya', [{ values: pendapatanLain, sign: 1 }, { values: biayaLain, sign: -1 }], true);

    const pajakPenghasilan = pushRow('9.1 Pajak Penghasilan', rowValues('9.1 Pajak Penghasilan'));
    const labaBersih = combine('LABA BERSIH', [{ values: labaOperasional, sign: 1 }, { values: totalPendapatanLainnya, sign: 1 }, { values: pajakPenghasilan, sign: -1 }], true);

    return { success: true, columns: columns, rows: rows, laba_bersih: labaBersih };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function generateLaporanLR(data) {
  try {
    const periode = data.periode || new Date().toISOString().slice(0, 7);
    const penjualanAll = getAll('Penjualan_App');
    const pembelianAll = getAll('Pembelian_App');
    const kemasanAll = getAll('Master_Kemasan');

    let pendapatan = 0, hppTotal = 0, biayaOps = 0, biayaSample = 0, biayaKemasan = 0;

    if (penjualanAll.success) {
      // Uses the shared invoice map (sums `total` per invoice correctly,
      // instead of relying on total_tagihan which turned out to be
      // per-line-item rather than a consistent full-invoice-total for
      // some historically-imported invoices).
      const invoiceMap = buildPenjualanInvoiceMap_(penjualanAll.data);
      pendapatan = Object.values(invoiceMap)
        .filter(inv => formatTanggalCell(inv.tanggal).startsWith(periode))
        .reduce((sum, inv) => sum + inv.total, 0);
    }
    if (pembelianAll.success) {
      hppTotal = pembelianAll.data
        .filter(p => formatTanggalCell(p.tanggal).startsWith(periode) && p.kode_transaksi === 'Pembelian')
        .reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
      // Sample giveaways are a sales & marketing cost, not COGS - counted
      // as an operating expense so they still reduce net profit correctly
      // instead of disappearing from the P&L entirely.
      biayaSample = pembelianAll.data
        .filter(p => formatTanggalCell(p.tanggal).startsWith(periode) && (p.kode_transaksi || '').toString().trim().toLowerCase() === 'sample')
        .reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
      // "Pembelian Biaya" is the pattern actually used for payroll,
      // commission, etc (Biaya_Operasional was a separate table that
      // never had a form/UI feeding it, so it never captured anything real).
      biayaOps = pembelianAll.data
        .filter(p => formatTanggalCell(p.tanggal).startsWith(periode) && p.kode_transaksi === 'Pembelian Biaya')
        .reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
    }
    biayaOps += biayaSample;

    // Kemasan (packaging) cost per sale was only ever tracked as a
    // quantity leaving stock, never as a cost - meaning it was invisible
    // in the P&L even though it's a real cost of making the sale, exactly
    // like Overhead is for a production batch. Master_Kemasan.harga is
    // empty in this data, so the price comes from the same average-
    // purchase-price approach used for raw materials elsewhere.
    if (penjualanAll.success && pembelianAll.success) {
      const kemasanPriceAgg = {};
      pembelianAll.data.forEach(r => {
        const nama = (r.nama_barang || '').toString().trim().toLowerCase();
        const qty = parseFloat(r.jumlah) || 0;
        const harga = parseFloat(r.harga_satuan) || 0;
        if (!nama || qty <= 0) return;
        if (!kemasanPriceAgg[nama]) kemasanPriceAgg[nama] = { qty: 0, value: 0 };
        kemasanPriceAgg[nama].qty += qty;
        kemasanPriceAgg[nama].value += qty * harga;
      });
      const kemasanNameSet = {};
      if (kemasanAll.success) {
        kemasanAll.data.forEach(k => { if (k.nama_kemasan) kemasanNameSet[k.nama_kemasan.toString().trim().toLowerCase()] = true; });
      }
      biayaKemasan = penjualanAll.data
        .filter(p => formatTanggalCell(p.tanggal).startsWith(periode))
        .reduce((sum, p) => {
          const kemasanNama = (p.kemasan || '').toString().trim().toLowerCase();
          const jumlahKemasan = parseFloat(p.jumlah_kemasan) || 0;
          if (!kemasanNama || jumlahKemasan <= 0) return sum;
          const agg = kemasanPriceAgg[kemasanNama];
          const hargaKemasan = agg && agg.qty > 0 ? agg.value / agg.qty : 0;
          return sum + (hargaKemasan * jumlahKemasan);
        }, 0);
    }
    hppTotal += biayaKemasan;

    const labaKotor = pendapatan - hppTotal;
    const labaBersih = labaKotor - biayaOps;
    const round2 = n => Math.round((n + Number.EPSILON) * 100) / 100;

    const lrData = {
      id_lr: generateId('LR'),
      periode: periode,
      pendapatan: round2(pendapatan),
      hpp_total: round2(hppTotal),
      laba_kotor: round2(labaKotor),
      biaya_operasional: round2(biayaOps),
      laba_bersih: round2(labaBersih)
    };
    create('Laporan_LR', lrData);
    return { success: true, data: lrData, rincian_hpp: { dari_pembelian: round2(hppTotal - biayaKemasan), biaya_kemasan: round2(biayaKemasan) } };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function getLaporanLR(periode) {
  const all = getAll('Laporan_LR');
  if (!all.success) return all;
  const records = all.data.filter(r => r.periode === periode);
  return { success: true, data: records };
}

function generateLaporanStock(data) {
  try {
    const tanggal = data.tanggal || new Date().toISOString().slice(0, 10);
    const produkAll = getAll('Master_Produk');
    if (!produkAll.success) return produkAll;

    const laporan = produkAll.data.map(p => {
      const stockData = getStock(p.id_produk);
      const saldo = stockData.success ? stockData.data.saldo || 0 : 0;
      const hppData = getHPP(p.id_produk);
      const hpp = hppData.success && hppData.data ? hppData.data.hpp_per_unit || 0 : 0;

      return {
        id_laporan: generateId('LST'),
        tanggal: tanggal,
        id_produk: p.id_produk,
        nama_produk: p.nama_produk,
        stok_awal: 0,
        masuk: 0,
        keluar: 0,
        stok_akhir: saldo,
        hpp: hpp,
        nilai_persediaan: saldo * hpp
      };
    });

    laporan.forEach(l => create('Laporan_Stock', l));
    return { success: true, data: laporan };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function getLaporanStock(tanggal) {
  const all = getAll('Laporan_Stock');
  if (!all.success) return all;
  const records = all.data.filter(r => r.tanggal === tanggal);
  return { success: true, data: records };
}

// ============================================================
// SYNC & LOG
// ============================================================
function syncAll(data) {
  try {
    let records = data.records;
    if (typeof records === 'string') {
      try { records = JSON.parse(records); } catch(e) { records = []; }
    }
    if (records && Array.isArray(records)) {
      records.forEach(record => {
        create(record.table, record.data);
      });
    }
    return { success: true, message: 'Sync completed', count: records ? records.length : 0 };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// One-click cleanup for the Log_Sync sheet, which the create()/logSync()
// recursion bug (now fixed) likely bloated with a large number of spurious
// rows during testing before the fix. Deletes all data rows, keeps headers.
// Wipes all data rows in Pembelian (keeps headers). Use this once after the
// Pembelian/Pembelian_Detail merge to clear out old header-only rows (which
// have no nama_barang/jumlah/harga_satuan and would otherwise sit mixed in
// with the new flat rows), then re-run importPembelianHistoris for a clean
// import under the new schema.
function resetPembelian() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Pembelian_App');
    if (!sheet) return { success: false, message: 'Sheet Pembelian not found' };
    const lastRow = sheet.getLastRow();
    let deleted = 0;
    if (lastRow > 1) {
      deleted = lastRow - 1;
      sheet.deleteRows(2, deleted);
    }
    return { success: true, message: deleted + ' baris lama di Pembelian dihapus, siap import ulang', deleted: deleted };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function resetAssemblyEntry() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Assembly_Entry');
    if (!sheet) return { success: false, message: 'Sheet Assembly_Entry not found' };
    const lastRow = sheet.getLastRow();
    let deleted = 0;
    if (lastRow > 1) {
      deleted = lastRow - 1;
      sheet.deleteRows(2, deleted);
    }
    return { success: true, message: deleted + ' baris lama di Assembly_Entry dihapus, siap import ulang', deleted: deleted };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function resetPenjualan() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Penjualan_App');
    if (!sheet) return { success: false, message: 'Sheet Penjualan_App not found' };
    const lastRow = sheet.getLastRow();
    let deleted = 0;
    if (lastRow > 1) {
      deleted = lastRow - 1;
      sheet.deleteRows(2, deleted);
    }
    return { success: true, message: deleted + ' baris lama di Penjualan_App dihapus, siap import ulang', deleted: deleted };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function resetKasMasuk() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Kas_Masuk');
    if (!sheet) return { success: false, message: 'Sheet Kas_Masuk not found' };
    const lastRow = sheet.getLastRow();
    let deleted = 0;
    if (lastRow > 1) {
      deleted = lastRow - 1;
      sheet.deleteRows(2, deleted);
    }
    return { success: true, message: deleted + ' baris lama di Kas_Masuk dihapus, siap import ulang', deleted: deleted };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function clearLogSync() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Log_Sync');
    if (!sheet) return { success: false, message: 'Sheet Log_Sync not found' };
    const lastRow = sheet.getLastRow();
    let deleted = 0;
    if (lastRow > 1) {
      deleted = lastRow - 1;
      sheet.deleteRows(2, deleted);
    }
    return { success: true, message: deleted + ' baris di Log_Sync dihapus', deleted: deleted };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function logSync(action, table, recordId, status) {
  try {
    create('Log_Sync', {
      id_log: generateId('LOG'),
      timestamp: new Date().toISOString(),
      action: action,
      table: table,
      record_id: recordId,
      status: status,
      message: action + ' on ' + table,
      user: Session.getActiveUser().getEmail() || 'anonymous'
    });
  } catch (e) {
    // Silent fail
  }
}
function DEBUG_TypePembayaran() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Penjualan_INV');
  
  // 1. Cek header ada apa saja
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Logger.log('=== HEADERS ===');
  headers.forEach((h, i) => Logger.log(i + ': ' + h));
  
  // 2. Cek kolom type_pembayaran
  const typeIdx = headers.indexOf('type_pembayaran');
  Logger.log('type_pembayaran index: ' + typeIdx);
  
  // 3. Cek data sample
  const data = sheet.getRange(2, 1, Math.min(5, sheet.getLastRow()-1), sheet.getLastColumn()).getValues();
  Logger.log('=== SAMPLE DATA ===');
  data.forEach((row, i) => {
    Logger.log('Row ' + (i+2) + ': no_invoice=' + row[headers.indexOf('no_invoice')] + 
                ', type_pembayaran=' + (typeIdx >= 0 ? row[typeIdx] : 'N/A'));
  });
  
  // 4. Test helper
  Logger.log('=== HELPER TEST ===');
  Logger.log('Cash on Hand-IDR → ' + mapCashAccountToTypePembayaran('Cash on Hand-IDR'));
  Logger.log('Cash in Bank BCA - IDR → ' + mapCashAccountToTypePembayaran('Cash in Bank BCA - IDR'));
  
  // 5. Cek reconcileAllInvoiceStatus ada
  Logger.log('=== FUNGSI CHECK ===');
  Logger.log('reconcileAllInvoiceStatus exists: ' + (typeof reconcileAllInvoiceStatus === 'function'));
  Logger.log('applyInvoicePaymentStatus_ exists: ' + (typeof applyInvoicePaymentStatus_ === 'function'));
  Logger.log('mapCashAccountToTypePembayaran exists: ' + (typeof mapCashAccountToTypePembayaran === 'function'));
}
